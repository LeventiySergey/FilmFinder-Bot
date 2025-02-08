import { MyContext } from "../types.ts";
import { getGPTResponse } from "../api/gptApi.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

// Interface for GPT response structure
interface GPTMoviesResponse {
  [key: string]: string;
}

// Handler to start interaction
async function byActorsHandler(ctx: MyContext) {
  ctx.session.waitingForActors = true;
  await ctx.reply("Please provide names of actors (example - Tom Hanks, Brad Pitt, etc.):");
}

// Handler to process actors input
async function handleActorsInput(ctx: MyContext) {
  if (ctx.session.waitingForActors) {
    const userMessage = ctx.message?.text;

    if (!userMessage) {
      await ctx.reply("Please provide a valid input.");
      return;
    }

    await ctx.reply("Analyzing your actors list...");

    try {
      // Get response from GPT
      const gptResponse = await getGPTResponse(`Input text: '${userMessage}'.
        If the movie text contains actors names (even with mistakes), you have to provide movies list (just titles, in json format but without '''json, example - '{
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
        await ctx.reply("No valid actors found in the input.");
      } else {
        // Generate keyboard
        const keyboard = new InlineKeyboard();

        movieTitles.forEach((title) => {
          const titleWithoutSpaces = title.replace(/\s/g, '•');
          keyboard.text(title, `movie_${titleWithoutSpaces}`).row();
        });

        // Send message with keyboard
        await ctx.reply(`Movies found:`, { reply_markup: keyboard });
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
      await ctx.reply("Sorry, there was an error processing your request.");
    }

    ctx.session.waitingForActors = false;
  }
}

// Export handlers
export { byActorsHandler, handleActorsInput };
