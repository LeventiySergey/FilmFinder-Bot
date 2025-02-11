import { Bot, session } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { MyContext, MySession } from "./types.ts"; // Импортируем тип контекста
import { mainKeyboard } from "./keyboards.ts";
import { setupHandlers } from "./handlers/index.ts";
import { getMovieDetails, getMovieDetailsById } from "./api/tmdbApi.ts"; // Импортируем функцию для получения деталей фильма

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

bot.callbackQuery(/^movie_.+$/, async (ctx) => {
  const encodedMovieName = ctx.match[0].split("_")[1];
  const movieName = decodeURIComponent(encodedMovieName);
  console.log(`User ${ctx.from?.username || ctx.from?.id} selected movie: ${movieName}`);
  await ctx.answerCallbackQuery();
  
  try {
    const movieDetails = await getMovieDetails(movieName);
    console.log(movieDetails)
    const title = movieDetails.title || "Title not available";
    const tagline = movieDetails.tagline || "Tagline not available";
    const description = movieDetails.overview || "Description not available";
    const releaseYear = movieDetails.release_date ? movieDetails.release_date.split("-")[0] : "Year not available";
    const rating = movieDetails.vote_average ? `${movieDetails.vote_average.toFixed(1)}/10` : "Rating not available";
    const posterUrl = movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null;

    let message = `🎬 *${title}*\n`;
    message += `🏷️ _${tagline}_\n\n`; // Wrap tagline with underscores
    message += `📝 *Description:* ${description}\n\n`;
    message += `📅 *Release Year:* ${releaseYear}\n`;
    message += `⭐ *Rating:* ${rating}`;

    const inlineKeyboard = {
      inline_keyboard: [[{ text: "More details", callback_data: `more_${movieDetails.id}` }]],
    };

    if (posterUrl) {
      await ctx.replyWithPhoto(posterUrl, { caption: message, parse_mode: "Markdown", reply_markup: inlineKeyboard });
    } else {
      await ctx.reply(message, { parse_mode: "Markdown", reply_markup: inlineKeyboard });
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    await ctx.reply(`Sorry, but it seems like we can't find any info about the movie "${movieName}". Please try searching for another movie.`);
  }
});

bot.callbackQuery(/^more_\d+$/, async (ctx) => {
  const movieId = ctx.match[0].split("_")[1];
  console.log(`User ${ctx.from?.username || ctx.from?.id} requested more details for movie ID: ${movieId}`);
  await ctx.answerCallbackQuery();

  try {
    const movieDetails = await getMovieDetailsById(movieId);
    const budget = movieDetails.budget ? `$${movieDetails.budget.toLocaleString()}` : "Budget not available";
    const director = movieDetails.credits.crew.find((member: any) => member.job === "Director")?.name || "Director not available";
    const runtime = movieDetails.runtime ? `${movieDetails.runtime} minutes` : "Runtime not available";

    let additionalDetails = `\n\n💵 *Budget:* ${budget}\n`;
    additionalDetails += `🎬 *Director:* ${director}\n`;
    additionalDetails += `⏱️ *Runtime:* ${runtime}`;

    if (ctx.callbackQuery.message?.text) {
      const existingMessage = ctx.callbackQuery.message.text;
      await ctx.editMessageText(existingMessage + additionalDetails, { parse_mode: "Markdown" });
    } else if (ctx.callbackQuery.message?.caption) {
      const existingCaption = ctx.callbackQuery.message.caption;
      await ctx.editMessageCaption({ caption: existingCaption + additionalDetails, parse_mode: "Markdown" });
    } else {
      console.error("No text or caption found in the message to edit.");
    }
  } catch (error) {
    console.error("Error fetching additional movie details:", error);
    await ctx.reply("Sorry, we couldn't retrieve additional movie information at the moment. Please check back later.");
  }
});

setupHandlers(bot);

bot.start();
