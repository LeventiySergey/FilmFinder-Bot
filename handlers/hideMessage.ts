import { MyContext } from "../types.ts";

async function hideMessageHandler(ctx: MyContext) {
  try {
    if (ctx.callbackQuery?.message?.message_id) {
      await ctx.api.deleteMessage(ctx.chat?.id!, ctx.callbackQuery.message.message_id);
    }
    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error("Error hiding message:", error);
    await ctx.answerCallbackQuery({ text: "Failed to hide the message." });
  }
}

export { hideMessageHandler };