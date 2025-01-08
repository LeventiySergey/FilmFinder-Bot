
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function byGenresHandler(ctx: Context) {
  await ctx.reply("Please, provide genres separated by commas.");
}

export {byGenresHandler}