import { Bot } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { MyContext } from "../types.ts"; 
import { searchMoviesHandler } from "./searchMovies.ts";
import { recommendationsHandler } from "./recommendations.ts";
import { favoritesHandler } from "./favorites.ts";
import { aboutBotHandler } from "./aboutBot.ts";
import { goBackHandler } from "./goBack.ts";
import { byDescriptionHandler, handleDescriptionInput } from "./byDescription.ts";
import { byActorsHandler, handleActorsInput } from "./byActors.ts";
import { byGenresHandler, handleGenresInput } from "./byGenres.ts";

function setupHandlers(bot: Bot<MyContext>) {
  bot.hears("🎥 Search Movies", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected Search Movies`);
    searchMoviesHandler(ctx);
  });
  bot.hears("🌟 Recommendations", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected Recommendations`);
    recommendationsHandler(ctx);
  });
  bot.hears("⭐ Favorites", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected Favorites`);
    favoritesHandler(ctx);
  });
  bot.hears("ℹ️ About Bot", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected About Bot`);
    aboutBotHandler(ctx);
  });
  bot.hears("🔙 Back", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected Back`);
    goBackHandler(ctx);
  });
  bot.hears("📝 By Text Description", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected By Text Description`);
    byDescriptionHandler(ctx);
  });
  bot.hears("🎬 By Genres", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected By Genres`);
    byGenresHandler(ctx);
  });
  bot.hears("🎭 By Actors", (ctx) => {
    console.log(`User ${ctx.from?.username || ctx.from?.id} selected By Actors`);
    byActorsHandler(ctx);
  });

  bot.on("message:text", async (ctx, next) => {
    if (ctx.session.waitingForDescription) {
      await handleDescriptionInput(ctx);
    } else if (ctx.session.waitingForActors) {
      await handleActorsInput(ctx);
    } else if (ctx.session.waitingForGenres) {
      await handleGenresInput(ctx);
    }
    else {
      await next();
    }
  });
}

export { setupHandlers };
