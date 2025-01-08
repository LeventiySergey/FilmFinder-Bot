
import { Bot } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { searchMoviesHandler } from "./searchMovies.ts";
import { recommendationsHandler } from "./recommendations.ts";
import { favoritesHandler } from "./favorites.ts";
import { aboutBotHandler } from "./aboutBot.ts";
import { goBackHandler } from "./goBack.ts";
import { byDescriptionHandler } from "./byDescription.ts";
import { byActorsHandler } from "./byActors.ts";
import { byGenresHandler } from "./byGenres.ts";

function setupHandlers(bot: Bot) {
  bot.hears("🎥 Search Movies", searchMoviesHandler);
  bot.hears("🌟 Recommendations", recommendationsHandler);
  bot.hears("⭐ Favorites", favoritesHandler);
  bot.hears("ℹ️ About Bot", aboutBotHandler);
  bot.hears("🔙 Back", goBackHandler);
  bot.hears("📝 By Text Description", byDescriptionHandler);
  bot.hears("🎬 By Genres", byGenresHandler);
  bot.hears("🎭 By Actors", byActorsHandler);
}

export {setupHandlers}