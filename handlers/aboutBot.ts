import { Context } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

async function aboutBotHandler(ctx: Context) {
  await ctx.reply(
    "🤖 *Film Finder Bot - Your Personal Movie Assistant!*\n\n" +
    "Here's what I can do for you:\n\n" +
    "🔍 *Search Movies*:\n" +
    "• 📝 By text description (e.g., 'funny romantic comedy')\n" +
    "• 🎭 By actors (e.g., 'Tom Hanks, Leonardo DiCaprio')\n" +
    "• 🎬 By genres (e.g., 'action, adventure')\n\n" +
    "✨ *Features*:\n" +
    "• ⭐ Save your favorite movies\n" +
    "• 🌟 Get personalized movie recommendations\n" +
    "• 📊 View detailed movie info (rating, budget, etc.)\n" +
    "• 🎥 Watch movie previews\n" +
    "• 🔍 Find similar movies\n\n" +
    "ℹ️ You get 5 searches per day to find your perfect movie!\n\n" +
    "🔗 Source code: [GitHub Repository](https://github.com/LeventiySergey/FilmFinder-Bot)\n\n" +
    "Ready to explore? Just click the buttons below! 🍿",
    { parse_mode: "Markdown" }
  );
}

export {aboutBotHandler}