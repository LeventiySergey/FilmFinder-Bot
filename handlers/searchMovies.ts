
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { searchMoviesKeyboard } from "../keyboards.ts";

async function searchMoviesHandler(ctx: Context) {
  await ctx.reply("How would you like to search for a movie today? Choose an option below:", {
    reply_markup: { keyboard: searchMoviesKeyboard.build(), resize_keyboard: true },
  });
}

export {searchMoviesHandler}