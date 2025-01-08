import { Bot } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { mainKeyboard } from "./keyboards.ts";
import { setupHandlers } from "./handlers/index.ts";

// Ініціалізація бота
const bot = new Bot(Deno.env.get("BOT_TOKEN")!);

// Обробка команди /start
bot.command("start", async (ctx) => {
  await ctx.reply("Welcome! Choose an action:", {
    reply_markup: { keyboard: mainKeyboard.build(), resize_keyboard: true },
  });
});

// Установка хендлерів
setupHandlers(bot);

// Запуск бота
bot.start();
