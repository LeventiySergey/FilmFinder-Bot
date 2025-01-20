import { Context, SessionFlavor } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

interface MySession {
  waitingForDescription: boolean;
  waitingForActors: boolean;
  waitingForGenres: boolean;
}

type MyContext = Context & SessionFlavor<MySession>;

export type { MyContext, MySession };
