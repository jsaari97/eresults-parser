import {
  RawScrapeData,
  IntervalsResults,
  IntervalParticipant,
  ControlPoint,
  TimePoint,
} from '../types';
import { constructRoute, mergeObj } from '../utils';

const characterIndices = (str: string, char: string): number[] => {
  const indices = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      indices.push(i);
    }
  }

  return indices;
};

export const cleanTags = (data: string): string[][] => {
  const rows = data
    .split('\n')
    .map((x) => x.replace('\r', ''))
    .filter(Boolean);
  const indices = characterIndices(rows[0], ']').map((x) => x + 1);

  return rows.map((row, rowIndex) =>
    indices
      .map((pos, i) => row.substring(indices[i - 1] || 0, pos))
      .concat(row.substring(indices[indices.length - 1]))
      .reduce((acc: string[], col, i, arr): string[] => {
        if (i === 0 && rowIndex % 2 === 1) {
          const index = col.lastIndexOf(' ');
          return [col.substring(0, index), col.substring(index)];
        } else if (i === arr.length - 1 && rowIndex > 0 && rowIndex % 2 === 0) {
          return acc;
        }

        return [...acc, col];
      }, [])
      .map((x) => x.trim())
  );
};

export const getEndTime = (col: string): string | null => (col.match(/\d/g) ? col : null);

export const constructTimePoint = (
  intervals: (TimePoint | null)[],
  col: string
): (TimePoint | null)[] => {
  const split = col.split('-');
  if (!split[0]) {
    return [...intervals, null];
  }

  const rank = Number(split.shift());
  const [time] = split;
  const diff = (intervals.slice().reverse().find(Boolean) || { rank }).rank - rank;

  return [...intervals, { rank, time, diff }];
};

export const getPositionAndName = (col: string): { position: number | null; name: string } => {
  if (!col.match(/\d/g)) {
    return {
      name: col,
      position: null,
    };
  }

  const [position, name] = col.split(/\.\s+/g);

  return {
    name: name ? name.replace(/(\s+)/g, ' ').trim() : '',
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
          name,
          position: Number(position),
          splits,
          time,
        },
      ];
    }

    return result;
  }, []);

export const constructPoints = (row: string[]): ControlPoint[] =>
  row
    .filter((point) => point.match(/\d/))
    .map((point): ControlPoint => {
      const parsed = point.replace(/(\[|\])/g, '');
      const position = parsed.match(/^(\d+)/);
      const identifier = parsed.match(/\.\s+(\d+)/);

      return {
        identifier: identifier ? identifier[1] : '',
        position: position ? Number(position[0]) : 0,
      };
    });

const parsePre = (pre: string): { participants: IntervalParticipant[]; points: ControlPoint[] } => {
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
    routes.map((route) => ({ route }))
  );

  return {
    results,
    routes,
    title,
  };
};
