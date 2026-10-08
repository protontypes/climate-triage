import positions from "./positions.json";

export interface OpenPosition {
  id: string;
  title: string;
  organization: string;
  url: string;
  source: string;
  sourceUrl: string;
  location: string;
  remote: boolean;
  postedAt: string;
}

export const getPositions = (): OpenPosition[] => [...(positions as OpenPosition[])];

export const getRemotePositions = (): OpenPosition[] =>
  getPositions().filter((position) => position.remote);
