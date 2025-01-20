import { MyContext } from "../types.ts"; 
import { getGPTResponse } from "../api/gptApi.ts";

async function byDescriptionHandler(ctx: MyContext) {
  ctx.session.waitingForDescription = true; 
  await ctx.reply("Please provide the movie description (example - Funny, sad and lifechanging, etc.):");
}

async function handleDescriptionInput(ctx: MyContext) {
  if (ctx.session.waitingForDescription) {
    const userMessage = ctx.message?.text;

    if (!userMessage) {
      await ctx.reply("Please provide a valid input.");
      return;
    }

    await ctx.reply("Analyzing your description...");

    try {
      const gptResponse = await getGPTResponse(`You have to provide movies list (just titles, in json format but without '''json, example - '{
    "1": "Fight Club",
    "2": "Seven",
    "3": "Inglourious Basterds",
    "4": "Once Upon a Time in Hollywood",
    "5": "Ocean's Eleven"
}', max - 5) by description: '${userMessage}'. YOU HAVE TO REMEMBER: If you think it's invalid or inappropriate description just send {}.` );
      const movies = JSON.parse(gptResponse);
      const movieTitles = Object.values(movies);

      if (movieTitles.length === 0) {
        await ctx.reply("No valid description found in the input.");
      } else {
        await ctx.reply(`Movies found: ${movieTitles.join(", ")}`);
      }
    } catch (error) {
      console.error("Error communicating with GPT API:", error);
      await ctx.reply("Sorry, there was an error processing your request.");
    }

    ctx.session.waitingForDescription = false; 
  }
}

export { byDescriptionHandler, handleDescriptionInput };
