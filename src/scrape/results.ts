import { RawScrapeData, RouteResult, Participant, Statistics, Results } from '../types';
import { constructRoute, mergeObj } from '../utils';

export const resolvePositionAndName = (col: string): [string, string] | [string] => {
  const match = col.match(/\d+/g);
  if (match) {
    return [match[0]];
  }

  const parsed = col.replace(/^([A-Za-z]{3}|-|\s+)+\s/, '').trim();
  const firstSpace = parsed.indexOf(' ');
  const first = parsed.substr(0, firstSpace);
  const rest = parsed.substr(firstSpace + 1);
  return ['null', `${first} ${rest}`];
};

export const constructParticipant = (row: string[]): Participant => {
  const [pos, name] = row;

  let association = null;
  if (row[2] && row[2].toLowerCase().match(/[a-z]/g)) {
    association = (row[3] && row[3].toLowerCase().match(/(\d+|[a-z])/g)) ? row[2] : null;
  }

  const [time, diff = null] = row.slice(association ? 3 : 2);
  const position = pos.match(/\d+/g);
  return {
    association,
    diff,
    name,
    position: position ? Number(position[0]) : null,
    time: time!.match(/\d+/g) ? time : null,
  };
};

const labels = [
  'started',
  'exited',
  'disqualified',
  'other',
];

export const constructStatistics = (row: string[]): Statistics =>
  row.slice(0, 3)
    .filter(Boolean)
    .reduce((acc: Statistics, cur: string, i: number): Statistics => ({
      ...acc,
      [labels[i]]: cur && cur.match(/\d+/g) ? Number(cur.match(/\d+/g)![0]) : 0,
    }), { started: 0, exited: 0, disqualified: 0 });

export const cleanTags = (data: string): string[][] =>
  data.split('\n')
    .map((row) =>
      row
        .replace(/\s\s+/g, ',')
        .replace('\r', '')
        .trim()
        .split(/(\d+\.\s|,)/)
        .map((col) => col.trim())
        .filter((col) => col && col !== ','))
    .filter((row) => row.length);

const parsePre = (pre: string): { participants: Participant[], statistics: Statistics } => {
  const rows = cleanTags(pre);

  const statistics = constructStatistics(rows.shift() || []);

  const participants = rows.map((row: string[]): Participant => {
    const first = resolvePositionAndName(row.shift() || '');
    return constructParticipant([...first, ...row]);
  });

  return {
    participants,
    statistics,
  };
};

export const parseResults = (data: RawScrapeData): Results => {
  const { title } = data;
  const routes = data.routes.map(constructRoute);

  const results = mergeObj(
    data.pre.map(parsePre),
    routes.map((route) => ({ route })),
  );

  return {
    results,
    routes,
    title,
  };
};
