import { Bot, session } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { MyContext, MySession } from "./types.ts"; // Импортируем тип контекста
import { mainKeyboard } from "./keyboards.ts";
import { setupHandlers } from "./handlers/index.ts";
import { movieHandler } from "./handlers/movie.ts";
import { moreHandler } from "./handlers/more.ts";
import { findSimilarHandler } from "./handlers/findSimilar.ts";
import { addOrRemoveMovieFromDatabase } from "./database/database.ts"; // Updated import
import { favoritesPageHandler } from "./handlers/favorites.ts"; // New import
import { hideMessageHandler } from "./handlers/hideMessage.ts"; // New import

const bot = new Bot<MyContext>(Deno.env.get("BOT_TOKEN")!);

bot.use(session({
  initial: (): MySession => ({
    waitingForDescription: false,
    waitingForActors: false, 
    waitingForGenres: false, 
  }),
}));

bot.command("start", async (ctx) => {
  console.log(`User ${ctx.from?.username || ctx.from?.id} started the bot`);
  await ctx.reply("Welcome! Choose an action:", {
    reply_markup: { keyboard: mainKeyboard.build(), resize_keyboard: true },
  });
});

bot.catch((err) => {
  console.error("Error in middleware:", err);
});

bot.callbackQuery(/^movie_.+$/, movieHandler);
bot.callbackQuery(/^more_\d+$/, moreHandler);
bot.callbackQuery(/^similar_.+$/, findSimilarHandler);
bot.callbackQuery(/^favorite_.+$/, addOrRemoveMovieFromDatabase); // Updated handler
bot.callbackQuery(/^favorites_page_.+$/, favoritesPageHandler); // New handler
bot.callbackQuery(/^hide_message$/, hideMessageHandler); // Add handler for 'Hide' button

setupHandlers(bot);

bot.start();
