import { createEffect, createStore } from "effector";
import { IBlessing } from "../../types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getBlessingsFx = createEffect<SupabaseClient | null, IBlessing[]>();

export const $blessings = createStore<IBlessing[]>([]).on(getBlessingsFx.doneData, (_, blessings) => blessings);
