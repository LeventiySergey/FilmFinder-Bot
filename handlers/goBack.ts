
import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { mainKeyboard } from "../keyboards.ts";

async function goBackHandler(ctx: Context) {
  await ctx.reply("Welcome! Choose an action:", {
    reply_markup: { keyboard: mainKeyboard.build(), resize_keyboard: true },
  });
}

export {goBackHandler}