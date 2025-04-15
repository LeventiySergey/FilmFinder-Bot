import { Context, SessionFlavor } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

interface MySession {
  waitingForDescription: boolean;
  waitingForActors: boolean;
  waitingForGenres: boolean;
}

interface User {
  userId: number;
  username: string;
  nickname: string;
  createdAt: Date;
  language: string;
  searchCount: number;
  lastSearchDate: string;
}

type MyContext = Context & SessionFlavor<MySession>;

export type { MyContext, MySession, User };
