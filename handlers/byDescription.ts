
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function byDescriptionHandler(ctx: Context) {
  await ctx.reply("Please, provide a description of the movie.");
}

export {byDescriptionHandler}