
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function aboutBotHandler(ctx: Context) {
  await ctx.reply(
    "This bot helps you find movies, provides personal recommendations, and manages your 'Favorites' list.",
  );
}

export {aboutBotHandler}