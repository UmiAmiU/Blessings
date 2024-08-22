import { SupabaseClient } from "@supabase/supabase-js";
import { createEffect, createEvent, createStore } from "effector";

export const init = createEvent();
export const initFx = createEffect<void, SupabaseClient>();

export const $dataBase = createStore<SupabaseClient | null>(null).on(
  initFx.doneData,
  (_, dataBaseApi) => dataBaseApi
);
