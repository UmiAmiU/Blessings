import { sample } from "effector";
import { init, initFx } from ".";
import { createClient } from "@supabase/supabase-js";
import { getBlessingsFx } from "../blessings";
import { getSessionsFx } from "../session";

initFx.use(async () => {
  const dataBaseAPI = createClient(
    "https://ggaapwquwmooyvnwogbg.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYWFwd3F1d21vb3l2bndvZ2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzIyNTUsImV4cCI6MjAzOTY0ODI1NX0.hTyEo5Mk9qa_ZKgXm1Pp7Ckg890U6XhGiA2Zcdz9BYY"
  );
  return dataBaseAPI;
});

sample({
  clock: init,
  target: initFx,
});

sample({
  clock: initFx.doneData,
  target: getBlessingsFx,
});

sample({
  clock: initFx.doneData,
  target: getSessionsFx,
});
