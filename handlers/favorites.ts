
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function favoritesHandler(ctx: Context) {
  await ctx.reply("Your 'Favorites' list.");
}

export {favoritesHandler}