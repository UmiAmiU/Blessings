import { createEffect, createEvent, createStore } from 'effector';
import { SupabaseClient } from '@supabase/supabase-js';
import { emptySession, IBlessing, ISession } from '../../types';

export const setSession = createEvent<ISession>();
export const getSessionsFx = createEffect<SupabaseClient | null, ISession[]>();
export const sessionUpdateSubscribe = createEffect<
  { api: SupabaseClient | null; session: ISession },
  void
>();
export const subscriptionUpdate = createEvent<ISession>();
export const updateSessionFx = createEffect<
  { api: SupabaseClient | null; session: ISession },
  ISession
>();
export const addSelectedBlessing = createEvent<{ selected: IBlessing, used: IBlessing[], isFirstPlayer: boolean }>();

export const $sessions = createStore<ISession[]>([]).on(getSessionsFx.doneData, (_, sessions) => sessions);
export const $session = createStore<ISession>(emptySession).on(setSession, (_, session) => session).on(subscriptionUpdate, (_, session) => session);
