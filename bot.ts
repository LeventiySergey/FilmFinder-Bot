import { Bot, session } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { MyContext, MySession } from "./types.ts"; // Импортируем тип контекста
import { mainKeyboard } from "./keyboards.ts";
import { setupHandlers } from "./handlers/index.ts";

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

bot.callbackQuery(/^movie_[\w•']+$/, async (ctx) => {
  const movieName = ctx.match[0].split("_")[1].replace(/•/g, " ");
  console.log(`User ${ctx.from?.username || ctx.from?.id} selected movie: ${movieName}`);
  await ctx.answerCallbackQuery();
  await ctx.reply(`You selected movie "${movieName}"`);
});

setupHandlers(bot);

bot.start();
