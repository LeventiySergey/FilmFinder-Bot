import { MyContext } from "../types.ts";
import { getFavoriteMovies } from "../database/database.ts";
import { getGPTResponse } from "../api/gptApi.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { truncateTextExact } from "./byDescription.ts";

async function recommendationsHandler(ctx: MyContext) {
  const userId = ctx.from?.id;
  await ctx.reply("🌟 Hang tight! We're analyzing your favorite movies to find the best recommendations for you...");

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  const favoriteMovies = await getFavoriteMovies(userId);

  if (favoriteMovies.length === 0) {
    await ctx.reply("You have no favorite movies yet.");
    return;
  }

  // Randomly select 5 favorite movies
  const selectedMovies = favoriteMovies.sort(() => 0.5 - Math.random()).slice(0, 5);

  try {
    const gptResponse = await getGPTResponse(
      `You have to provide (not the most popular, but good) movies (not series) list (just english titles, in json format but without '''json, example - '{
        "1": "Fight Club",
        "2": "Seven",
        "3": "Inglourious Basterds",
        "4": "Once Upon a Time in Hollywood",
        "5": "Ocean's Eleven"
      }', max - 5) based on these favorite movies: ${selectedMovies.join(", ")}. Note: try to provide not similar to each other movies.`
    );

    const recommendations = JSON.parse(gptResponse);
    const movieTitles = Object.values(recommendations) as string[];

    // Truncate all recommended movie titles to 33 characters
    const truncatedMovieTitles = movieTitles.map(title => truncateTextExact(title, 33));

    // Filter out movies that are already in the user's favorites
    const filteredMovies = truncatedMovieTitles.filter(title => !favoriteMovies.includes(title));

    if (filteredMovies.length === 0) {
      await ctx.reply("🎬 It looks like you've already seen all our top recommendations! 🎬\n\nYou can try pressing the button again for more suggestions. 🔄 If you see this message again, consider adding more favorite movies to get new recommendations. 🍿");
    } else {
      const keyboard = new InlineKeyboard();
      filteredMovies.forEach((title) => {
        const encodedTitle = encodeURIComponent(title);
        keyboard.text(title, `movie_${encodedTitle}`).row();
      });

      await ctx.reply("Recommended movies:", { reply_markup: keyboard });
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    await ctx.reply("Sorry, there was an error fetching recommendations.");
  }
}

export { recommendationsHandler };