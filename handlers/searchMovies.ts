
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { searchMoviesKeyboard } from "../keyboards.ts";

async function searchMoviesHandler(ctx: Context) {
  await ctx.reply("Choose an action:", {
    reply_markup: { keyboard: searchMoviesKeyboard.build(), resize_keyboard: true },
  });
}

export {searchMoviesHandler}