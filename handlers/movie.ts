import { MyContext } from "../types.ts";
import { getMovieDetails } from "../api/tmdbApi.ts";

async function movieHandler(ctx: MyContext) {
  if (!ctx.match) {
    await ctx.reply("Sorry, something went wrong. Please try again.");
    return;
  }
  const encodedMovieName = ctx.match[0].split("_")[1];
  const movieName = decodeURIComponent(encodedMovieName).slice(0, -1);
  console.log(`User ${ctx.from?.username || ctx.from?.id} selected movie: ${movieName}`);
  await ctx.answerCallbackQuery();
  await new Promise(resolve => setTimeout(resolve, 500)); // Add a 500 ms delay
  
  try {
    const movieDetails = await getMovieDetails(movieName);
    const title = movieDetails.title || "Title not available";
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
        [{ text: "Find similar", callback_data: `similar_${encodedMovieName}` }]
      ],
    };

    if (posterUrl) {
      await ctx.replyWithPhoto(posterUrl, { caption: message, parse_mode: "Markdown", reply_markup: inlineKeyboard });
    } else {
      await ctx.reply(message, { parse_mode: "Markdown", reply_markup: inlineKeyboard });
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    await ctx.reply(`Sorry, but it seems like we can't find any info about the movie "${movieName}". Please try searching for another movie.`);
  }
}

export { movieHandler };
