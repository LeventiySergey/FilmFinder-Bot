import { MyContext } from "../types.ts";
import { getGPTResponse } from "../api/gptApi.ts";
import { getMovieDetails } from "../api/tmdbApi.ts";
import { truncateTextExact } from "./byDescription.ts";

// Interface for GPT response structure
interface GPTMoviesResponse {
  [key: string]: string;
}

// Handler for finding similar movies
async function findSimilarHandler(ctx: MyContext) {
  if (!ctx.match || !ctx.match[0]) {
    await ctx.reply("Invalid request format.");
    return;
  }
  const movieName = ctx.match[0].split("_")[1];
  const decodedMovieName = decodeURIComponent(movieName);

  let message = `⏳ Finding a movie similar to ${decodedMovieName}`;
  if (decodedMovieName[decodedMovieName.length - 1] === '…') {
    message = message + ' Oops, I forgot how it goes after that 😅';
  } 
  await ctx.reply(message);

  await ctx.answerCallbackQuery();
  await new Promise(resolve => setTimeout(resolve, 500)); // Add a 500 ms delay

  try {
    // Get response from GPT
    const gptResponse = (await getGPTResponse(
      `Provide one random (not the most popular) movie (not series) title similar to: '${decodedMovieName}' in JSON format like {"1": "Movie Title"}. Only return the JSON object, no additional text.`
    )) as string; // Cast to string

    // Parse JSON response
    let movies: GPTMoviesResponse;
    try {
      movies = JSON.parse(gptResponse.replace(/```json|```/g, '').trim());
    } catch (parseError) {
      console.error("Error parsing GPT response:", parseError);
      await ctx.reply("Sorry, there was an error processing the response from the GPT API.");
      return;
    }

    const movieTitle = Object.values(movies)[0];

    // If no movie found
    if (!movieTitle) {
      await ctx.reply("No similar movie found.");
    } else {
      // Get movie details
      const movieDetails = await getMovieDetails(movieTitle);
      const title = movieDetails.title || "Title not available";
      const truncatedTitle = truncateTextExact(title, 30);
      const tagline = movieDetails.tagline || "Tagline not available";
      const genres = movieDetails.genres.map((genre: { name: string }) => genre.name).join(", ") || "Genres not available";
      const releaseYear = movieDetails.release_date ? movieDetails.release_date.split("-")[0] : "Year not available";
      const rating = movieDetails.vote_average ? `${movieDetails.vote_average.toFixed(1)}/10` : "Rating not available";
      const posterUrl = movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null;

      let message = `🎬 *${title}*\n`;
      message += `🏷️ _${tagline}_\n\n`;
      message += `🎭 *Genres:* ${genres}\n`;
      message += `📅 *Release Year:* ${releaseYear}\n`;
      message += `⭐ *Rating:* ${rating}`;

      const inlineKeyboard = {
        inline_keyboard: [
          [{ text: "More details", callback_data: `more_${movieDetails.id}` }],
          [{ text: "Find similar", callback_data: `similar_${encodeURIComponent(truncatedTitle)}` }],
          [{ text: "⭐️ Favorite", callback_data: `favorite_${encodeURIComponent(truncatedTitle)}`}]
        ],
      };

      if (posterUrl) {
        await ctx.replyWithPhoto(posterUrl, { caption: message, parse_mode: "Markdown", reply_markup: inlineKeyboard });
      } else {
        await ctx.reply(message, { parse_mode: "Markdown", reply_markup: inlineKeyboard });
      }
    }
  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    await ctx.reply("Sorry, there was an error processing your request.");
  }
}

// Export handler
export { findSimilarHandler };
