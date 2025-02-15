import { MyContext } from "../types.ts";
import { getMovieDetails, getMovieDetailsById } from "../api/tmdbApi.ts";
import {truncateTextExact} from "./byDescription.ts";

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return truncated + "...";
  }
  return truncated.substring(0, lastSpaceIndex) + "...";
}

async function moreHandler(ctx: MyContext) {
  const movieId = ctx.match ? ctx.match[0].split("_")[1] : null;
  if (!movieId) {
    console.error("Movie ID not found in the callback query.");
    return;
  }
  await ctx.answerCallbackQuery();
  await new Promise(resolve => setTimeout(resolve, 500)); // Add a 500 ms delay

  try {
    const movieDetails = await getMovieDetailsById(movieId);
    console.log(`User ${ctx.from?.username || ctx.from?.id} requested more details for movie: ${movieDetails.title}`);
    const budget = movieDetails.budget ? `$${movieDetails.budget.toLocaleString()}` : "Budget not available";
    const description = movieDetails.overview ? truncateText(movieDetails.overview, 500) : "Description not available";
    const truncatedTitle = truncateTextExact(movieDetails.title, 30); // Use new truncate function
    interface CrewMember {
      job: string;
      name: string;
    }
    const director = movieDetails.credits.crew.find((member: CrewMember) => member.job === "Director")?.name || "Director not available";
    const runtime = movieDetails.runtime ? `${movieDetails.runtime} minutes` : "Runtime not available";

    let additionalDetails = `\n\n📝 *Description:* ${description}\n\n`;
    additionalDetails += `💵 *Budget:* ${budget}\n`;
    additionalDetails += `🎬 *Director:* ${director}\n`;
    additionalDetails += `⏱️ *Runtime:* ${runtime}`;

    const inlineKeyboard = {
      inline_keyboard: [
        [{ text: "Find similar", callback_data: `similar_${encodeURIComponent(truncatedTitle)}` }]
      ],
    };

    if (ctx.callbackQuery?.message?.text) {
      const existingMessage = ctx.callbackQuery.message.text;
      await ctx.editMessageText(existingMessage + additionalDetails, { parse_mode: "Markdown", reply_markup: inlineKeyboard });
    } else if (ctx.callbackQuery?.message?.caption) {
      const existingCaption = ctx.callbackQuery.message.caption;
      await ctx.editMessageCaption({ caption: existingCaption + additionalDetails, parse_mode: "Markdown", reply_markup: inlineKeyboard });
    } else {
      console.error("No text or caption found in the message to edit.");
    }
  } catch (error) {
    console.error("Error fetching additional movie details:", error);
    await ctx.reply("Sorry, we couldn't retrieve additional movie information at the moment. Please check back later.");
  }
}

export { moreHandler, truncateText };
