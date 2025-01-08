
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function byActorsHandler(ctx: Context) {
  await ctx.reply("Please, provide names of actors separated by commas.");
}

export {byActorsHandler}