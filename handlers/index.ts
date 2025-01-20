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
  bot.hears("🎥 Search Movies", searchMoviesHandler);
  bot.hears("🌟 Recommendations", recommendationsHandler);
  bot.hears("⭐ Favorites", favoritesHandler);
  bot.hears("ℹ️ About Bot", aboutBotHandler);
  bot.hears("🔙 Back", goBackHandler);
  bot.hears("📝 By Text Description", byDescriptionHandler);
  bot.hears("🎬 By Genres", byGenresHandler);
  bot.hears("🎭 By Actors", byActorsHandler);


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
