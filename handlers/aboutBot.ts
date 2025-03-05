
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function aboutBotHandler(ctx: Context) {
  await ctx.reply(
    "Hi there! I'm your movie companion bot. I can help you find movies, give you personal recommendations, and manage your 'Favorites' list. Let's get started!"
  );
}

export {aboutBotHandler}