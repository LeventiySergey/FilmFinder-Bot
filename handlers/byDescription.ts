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
async function byDescriptionHandler(ctx: MyContext) {
  ctx.session.waitingForDescription = true;
  ctx.session.waitingForGenres = false;
  ctx.session.waitingForActors = false;
  await ctx.reply(
    "Awesome! Please provide the movie description (e.g., funny, sad, life-changing, etc.):"
  );
}

// Handler to process description input
async function handleDescriptionInput(ctx: MyContext) {
  if (ctx.session.waitingForDescription) {
    const userMessage = ctx.message?.text;

    if (!userMessage) {
      await ctx.reply("It seems like you didn't provide a description. Please try again.");
      return;
    }

    console.log(`[DESC] User ${ctx.from?.username || ctx.from?.id}'s input:`, userMessage); // Log user input

    await ctx.reply("Got it! Analyzing your description...");

    try {
      // Get response from GPT
      const gptResponse = (await getGPTResponse(
        `You have to provide movies (not series) list (just english titles, in json format but without '''json, example - '{
          "1": "Fight Club",
          "2": "Seven",
          "3": "Inglourious Basterds",
          "4": "Once Upon a Time in Hollywood",
          "5": "Ocean's Eleven"
        }', max - 5) by description: '${userMessage}'. 
        YOU HAVE TO REMEMBER: If you think it's invalid or inappropriate description just send {}.`
      )) as string; // Cast to string

      // Parse JSON response
      const movies: GPTMoviesResponse = JSON.parse(gptResponse);
      const movieTitles = Object.values(movies);

      // If no movies found
      if (movieTitles.length === 0) {
        await ctx.reply("Hmm, I couldn't find any movies based on that description. Please try again with a different description.");
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

    ctx.session.waitingForDescription = false;
  }
}

// Export handlers
export { byDescriptionHandler, handleDescriptionInput, truncateTextExact };
