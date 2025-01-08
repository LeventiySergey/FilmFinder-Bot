
import { Keyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

const mainKeyboard = new Keyboard()
  .text("🎥 Search Movies").row()
  .text("🌟 Recommendations").row()
  .text("⭐ Favorites").row()
  .text("ℹ️ About Bot");

const searchMoviesKeyboard = new Keyboard()
  .text("📝 By Text Description").row()
  .text("🎭 By Actors").row()
  .text("🎬 By Genres").row()
  .text("🔙 Back");

export {mainKeyboard, searchMoviesKeyboard}