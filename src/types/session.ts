import { IBlessing } from './blessing';
import { emptyPlayer, IPlayer } from './player';

export interface ISession {
  id: string;
  firstPlayer: IPlayer;
  secondPlayer: IPlayer;
  blessingsToSelect: IBlessing[];
  usedBlessings: IBlessing[];
  finished: boolean;
}

export const emptySession: ISession = {
  id: '',
  firstPlayer: emptyPlayer,
  secondPlayer: emptyPlayer,
  blessingsToSelect: [],
  usedBlessings: [],
  finished: false,
};
