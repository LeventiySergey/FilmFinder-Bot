import { MyContext } from "../types.ts";
import { mainKeyboard } from "../keyboards.ts";

async function goBackHandler(ctx: MyContext) {
  ctx.session.waitingForDescription = false;
  ctx.session.waitingForActors = false;
  ctx.session.waitingForGenres = false;
  await ctx.reply("What would you like to do today? Choose an option below:", {
    reply_markup: { keyboard: mainKeyboard.build(), resize_keyboard: true },
  });
}

export { goBackHandler }