import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function aboutBotHandler(ctx: Context) {
  await ctx.reply(
    "🤖 Hi there! I'm your friendly movie assistant. I can help you find movies, give recommendations, and manage your favorites list. Let's explore some great films together! 🎥",
  );
}

export {aboutBotHandler}