import { IBlessing } from './blessing';

export interface IPlayer {
  id: string;
  sessionId: string;
  name: string;
  selectedBlessings: IBlessing[];
}

export const emptyPlayer: IPlayer = {
  id: '',
  sessionId: '',
  name: '',
  selectedBlessings: [],
};
