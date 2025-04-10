import { MyContext } from "../types.ts";
import { getFavoriteMovies } from "../database/database.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.33.0/mod.ts";

const MOVIES_PER_PAGE = 5;

async function favoritesHandler(ctx: MyContext) {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  const favoriteMovies = await getFavoriteMovies(userId);

  if (favoriteMovies.length === 0) {
    await ctx.reply("🎥 You don't have any favorite movies yet. Start adding some to build your list! 😊");
  } else {
    await sendFavoriteMoviesPage(ctx, favoriteMovies, 1);
  }
}

async function sendFavoriteMoviesPage(ctx: MyContext, movies: string[], page: number) {
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  const endIndex = startIndex + MOVIES_PER_PAGE;
  const moviesPage = movies.slice(startIndex, endIndex);

  const keyboard = new InlineKeyboard();
  moviesPage.forEach((title) => {
    const encodedTitle = encodeURIComponent(title);
    keyboard.text(title, `movie_${encodedTitle}`).row();
  });

  if (page > 1) {
    keyboard.text("⬅️", `favorites_page_${page - 1}_${totalPages}`);
  }
  keyboard.text(`${page}/${totalPages}`, `favorites_page_${page}_${totalPages}`);
  if (page < totalPages) {
    keyboard.text("➡️", `favorites_page_${page + 1}_${totalPages}`);
  }

  if (ctx.callbackQuery) {
    await ctx.editMessageText("Your favorite movies:", { reply_markup: keyboard });
  } else {
    await ctx.reply("Your favorite movies:", { reply_markup: keyboard });
  }
}

async function favoritesPageHandler(ctx: MyContext) {
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  const data = ctx.match ? ctx.match[0].split("_") : null;
  if (!data || data.length < 3) {
    await ctx.reply("Invalid request format.");
    return;
  }

  const page = parseInt(data[2], 10);
  const currentPage = parseInt(data[1], 10);

  if (page === currentPage) {
    await ctx.answerCallbackQuery();
    return;
  }

  const favoriteMovies = await getFavoriteMovies(userId);

  await sendFavoriteMoviesPage(ctx, favoriteMovies, page);
}

export { favoritesHandler, favoritesPageHandler };