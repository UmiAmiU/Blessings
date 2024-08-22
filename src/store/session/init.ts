import { sample } from 'effector';
import {
  $session,
  addSelectedBlessing,
  getSessionsFx,
  sessionUpdateSubscribe,
  setSession,
  subscriptionUpdate,
  updateSessionFx,
} from '.';
import { ISession } from '../../types';
import { $dataBase } from '../start';
import { $blessings } from '../blessings';
import { getRandomInt } from '../../utils/getRandomInt';

getSessionsFx.use(async (api) => {
  if (api) {
    const { data, error } = await api
      .from('sessions')
      .select()
      .returns<ISession[]>();
    if (error) {
      throw error;
    }
    return data;
  }
  return [];
});

sessionUpdateSubscribe.use(async ({ api, session }) => {
  if (api) {
    api
      .channel('session_update')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          subscriptionUpdate(payload.new as ISession);
          console.log('fsad');
        }
      )
      .subscribe();
  }
});

updateSessionFx.use(async ({ api, session }) => {
  if (api) {
    const { error } = await api.from('sessions').upsert(session);
    if (error) {
      throw error;
    }
  }
  return session;
});

sample({
  clock: setSession,
  source: { api: $dataBase, blessings: $blessings },
  fn: ({ api, blessings }, session) => {
    if (session.blessingsToSelect.length === 0 && session.usedBlessings.length < 18) {
      const existingBlessings = blessings.filter(
        (blessing) =>
          !session.usedBlessings.some((elem) => elem.id === blessing.id)
      );
      const cost1 = existingBlessings.filter((blessing) => blessing.cost === 1);
      const cost2 = existingBlessings.filter((blessing) => blessing.cost === 2);
      const cost3 = existingBlessings.filter((blessing) => blessing.cost === 3);
      if (cost1.length > 0) {
        session.blessingsToSelect = [
          cost1[getRandomInt(cost1.length - 1)],
          cost2[getRandomInt(cost2.length - 1)],
          cost3[getRandomInt(cost3.length - 1)],
        ]
      } else {
        session.blessingsToSelect = [];
      }
    }
    return { api, session };
  },
  target: [updateSessionFx, sessionUpdateSubscribe],
});

sample({
  clock: addSelectedBlessing,
  source: { api: $dataBase, session: $session, blessings: $blessings },
  fn: ({ api, session, blessings }, { selected, used, isFirstPlayer }) => {
    const updatedSession = { ...session };
    if (isFirstPlayer) {
      updatedSession.firstPlayer.selectedBlessings.push(selected);
    } else {
      updatedSession.secondPlayer.selectedBlessings.push(selected);
    }
    updatedSession.usedBlessings.push(...used);
    if (updatedSession.usedBlessings.length >= 18) {
      updatedSession.finished = true;
      updatedSession.blessingsToSelect = [];
    } else {
      const existingBlessings = blessings.filter(
        (blessing) =>
          !updatedSession.usedBlessings.some((elem) => elem.id === blessing.id)
      );
      const cost1 = existingBlessings.filter((blessing) => blessing.cost === 1);
      const cost2 = existingBlessings.filter((blessing) => blessing.cost === 2);
      const cost3 = existingBlessings.filter((blessing) => blessing.cost === 3);
      if (cost1.length > 0) {
        updatedSession.blessingsToSelect = [
          cost1[getRandomInt(cost1.length - 1)],
          cost2[getRandomInt(cost2.length - 1)],
          cost3[getRandomInt(cost3.length - 1)],
        ]
      } else {
        updatedSession.blessingsToSelect = [];
      }
    }
    return { api, session: updatedSession };
  },
  target: updateSessionFx,
});
