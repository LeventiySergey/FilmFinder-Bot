import { MyContext } from "../types.ts";
import { getGPTResponse } from "../api/gptApi.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

// Interface for GPT response structure
interface GPTMoviesResponse {
  [key: string]: string;
}

// New truncate function
function truncateTextExact(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + "…" : text;
}

// Handler to start interaction
async function byActorsHandler(ctx: MyContext) {
  ctx.session.waitingForActors = true;
  ctx.session.waitingForGenres = false;
  ctx.session.waitingForDescription = false;
  await ctx.reply("Great! Please provide the names of actors you're interested in (e.g., Tom Hanks, Brad Pitt, etc.):");
}

// Handler to process actors input
async function handleActorsInput(ctx: MyContext) {
  if (ctx.session.waitingForActors) {
    const userMessage = ctx.message?.text;

    if (!userMessage) {
      await ctx.reply("It seems like you didn't provide any actor names. Please try again.");
      return;
    }

    console.log(`[ACTORS] User ${ctx.from?.username || ctx.from?.id}'s input:`, userMessage); // Log user input

    await ctx.reply("Got it! Analyzing your actors list...");

    try {
      // Get response from GPT
      const gptResponse = await getGPTResponse(`Input text: '${userMessage}'.
        If the movie text contains actors names (even with mistakes), you have to provide movies (not series) list (just english titles, in json format but without '''json, example - '{
    "1": "Fight Club",
    "2": "Seven",
    "3": "Inglourious Basterds",
    "4": "Once Upon a Time in Hollywood",
    "5": "Ocean's Eleven"
}', max - 5). '${userMessage}'. Try to find movies that contain all actors (at least one) from input. YOU HAVE TO REMEMBER: If you think there is no actors in input, or it's invalid or inappropriate description just send {}.` );
      const movies: GPTMoviesResponse = JSON.parse(gptResponse);
      const movieTitles = Object.values(movies);

      // If no movies found
      if (movieTitles.length === 0) {
        await ctx.reply("Hmm, I couldn't find any movies based on those actors. Please try again with different names.");
      } else {
        // Generate keyboard
        const keyboard = new InlineKeyboard();

        movieTitles.forEach((title) => {
          const truncatedTitle = truncateTextExact(title, 33); // Use new truncate function
          const encodedTitle = encodeURIComponent(truncatedTitle);
          keyboard.text(truncatedTitle, `movie_${encodedTitle}`).row();
        });

        // Send message with keyboard
        await ctx.reply(`Here are some movies you might like:`, { reply_markup: keyboard });
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
      await ctx.reply("Sorry, something went wrong while processing your request. Please try again later.");
    }

    ctx.session.waitingForActors = false;
  }
}

// Export handlers
export { byActorsHandler, handleActorsInput };
