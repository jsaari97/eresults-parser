import { RawScrapeData, IntervalsResults, IntervalParticipant, ControlPoint, TimePoint } from '../types';
import {
  constructRoute,
  mergeObj,
} from '../utils';

export const cleanTags = (data: string): string[][] => data.split('\n')
  .map((row) =>
    row
      .replace(/(\s\s+)/g, ' ')
      .replace(/([0-9])([A-Za-z])/g, '$1 $2')
      .replace(/(-)([A-Za-z])/g, '$1 $2')
      .replace('\r', '')
      .split(/(?=\s\d+|\s-\s|^-\s|\s-$|(?<=[-0-9])\s+(?=[a-zA-Z]))/g)
      .map((col) => col.trim())
      .filter(Boolean),
  )
  .filter((row) => row.length);

export const getEndTime = (col: string): string | null => col.match(/\d/g) ? col : null;

export const constructTimePoint = (intervals: Array<TimePoint | null>, col: string): Array<TimePoint | null> => {
  const split = col.split('-');
  if (!split[0]) {
    return [...intervals, null];
  }
  const rank = Number(split.shift());
  const [time] = split;
  const diff = (intervals.slice().reverse().find(Boolean) || { rank }).rank - rank;

  return [
    ...intervals,
    { rank, time, diff },
  ];
};

export const getPositionAndName = (col: string): { position: number, name: string } => {
  const [position, name] = col.split(/\.\s+/g);
  return {
    name,
    position: Number(position),
  };
};

export const constructIntervalParticipants = (rows: string[][]): IntervalParticipant[] =>
  rows.reduce((result: IntervalParticipant[], row, i) => {
    if (i % 2 === 0) {
      const { position, name } = getPositionAndName(row.shift() || '');
      const time = getEndTime(row.pop() || '');
      const increments = row.reduce(constructTimePoint, []);
      const splits = rows[i + 1] ? rows[i + 1].reduce(constructTimePoint, []) : [];
      return [
        ...result,
        {
          increments,
          name: name || '',
          position: Number(position),
          splits,
          time,
        },
      ];
    }

    return result;
  }, []);

export const constructPoints = (row: string[]): ControlPoint[] =>
  row.map((point): ControlPoint => {
    const parsed = point.replace(/(\[|\])/g, '');
    const position = parsed.match(/^(\d+)/);
    const identifier = parsed.match(/\.\s+(\d+)/);
    return {
      identifier: identifier ? identifier[1] : '',
      position: position ? Number(position[0]) : 0,
    };
  });

const parsePre = (pre: string): { participants: IntervalParticipant[], points: ControlPoint[] } => {
  const rows = cleanTags(pre);
  const points = constructPoints(rows.shift() || []);

  const participants = constructIntervalParticipants(rows);

  return {
    participants,
    points,
  };
};

export const parseIntervals = (data: RawScrapeData): IntervalsResults => {
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
