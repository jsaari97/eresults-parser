export interface Route {
  name: string;
  length: number | null;
}

export interface Participant {
  position: number | null;
  name: string;
  association: string | null;
  time: string | null;
  diff: string | null;
}

export interface Statistics {
  started: number;
  exited: number;
  disqualified: number;
}

export interface RouteResult {
  statistics: Statistics;
  participants: Participant[];
  route: Route;
}

export interface RequestQuery {
  url: string;
}

export interface RawScrapeData {
  title: string;
  routes: string[];
  pre: string[];
}

export interface Results {
  title: string;
  results: RouteResult[];
  routes: Route[];
}

export interface ControlPoint {
  position: number;
  identifier: string;
}

export interface TimePoint {
  rank: number;
  diff: number;
  time: string;
}

export interface IntervalParticipant {
  position: number | null;
  name: string;
  time: string | null;
  increments: Array<TimePoint | null>;
  splits: Array<TimePoint | null>;
}

export interface RouteIntervalResult {
  points: ControlPoint[];
  participants: IntervalParticipant[];
  route: Route;
}

export interface IntervalsResults {
  title: string;
  results: RouteIntervalResult[];
  routes: Route[];
}
