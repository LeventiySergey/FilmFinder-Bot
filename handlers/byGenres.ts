import { MyContext } from "../types.ts";
import { getGPTResponse } from "../api/gptApi.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";
import { checkAndUpdateSearchLimit, getRemainingSearches } from "../database/database.ts";

// Interface for GPT response structure
interface GPTMoviesResponse {
  [key: string]: string;
}

// New truncate function
function truncateTextExact(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
}

// Handler to start interaction
async function byGenresHandler(ctx: MyContext) {
  const remainingSearches = await getRemainingSearches(ctx);
  
  if (remainingSearches === 0) {
    await ctx.reply("⚠️ You've reached your daily search limit (5 searches per day). Please try again tomorrow!");
    return;
  }

  ctx.session.waitingForGenres = true;
  ctx.session.waitingForDescription = false;
  ctx.session.waitingForActors = false;
  await ctx.reply(`Please provide genres (example - drama, comedy, etc.):\n\nYou have ${remainingSearches} search${remainingSearches === 1 ? '' : 'es'} remaining today.`);
}

// Handler to process genre input
async function handleGenresInput(ctx: MyContext) {
  if (ctx.session.waitingForGenres) {
    // Check search limit
    const canSearch = await checkAndUpdateSearchLimit(ctx);
    if (!canSearch) {
      await ctx.reply("⚠️ You've reached your daily search limit (5 searches per day). Please try again tomorrow!");
      ctx.session.waitingForGenres = false;
      return;
    }

    const userMessage = ctx.message?.text;

    if (!userMessage) {
      await ctx.reply("Please provide a valid input.");
      return;
    }

    console.log(`[GENRES] User ${ctx.from?.username || ctx.from?.id}'s input:`, userMessage);

    await ctx.reply("🎭 Got it! Analyzing your genres list to find the best matches for you. Hang tight! 😊");

    try {
      // Get response from GPT
      const gptResponse = await getGPTResponse(`Input text: '${userMessage}'.
        If the movie text contains genres (for example comedy, adventure etc.), you have to provide movies (not series) list (just english titles, in json format but without '''json, example - '{
    "1": "Fight Club",
    "2": "Seven",
    "3": "Inglourious Basterds",
    "4": "Once Upon a Time in Hollywood",
    "5": "Ocean's Eleven"
}', max - 5). '${userMessage}'. YOU HAVE TO REMEMBER: If you think there is no genres in input, or it's invalid or inappropriate description just send {}.` );
      const movies: GPTMoviesResponse = JSON.parse(gptResponse);
      const movieTitles = Object.values(movies);

      // If no movies found
      if (movieTitles.length === 0) {
        await ctx.reply("No valid genres found in the input.");
      } else {
        // Generate keyboard
        const keyboard = new InlineKeyboard();

        movieTitles.forEach((title) => {
          const truncatedTitle = truncateTextExact(title, 33); // Use new truncate function
          const encodedTitle = encodeURIComponent(truncatedTitle);
          keyboard.text(truncatedTitle, `movie_${encodedTitle}`).row();
        });

        const remainingSearches = await getRemainingSearches(ctx);
        await ctx.reply(`Movies found (${remainingSearches} search${remainingSearches === 1 ? '' : 'es'} remaining today):`, { reply_markup: keyboard });
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
      await ctx.reply("Sorry, there was an error processing your request.");
    }

    ctx.session.waitingForGenres = false;
  }
}

// Export handlers
export { byGenresHandler, handleGenresInput };
