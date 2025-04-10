import { getMovieStills } from "../api/tmdbApi.ts";
import { MyContext } from "../types.ts";
import { InputMediaPhoto } from "https://deno.land/x/grammy@v1.33.0/types.ts";

async function previewHandler(ctx: MyContext) {
  if (!ctx.match || !ctx.match[0]) {
    await ctx.reply("Invalid request format.");
    return;
  }

  const movieId = ctx.match[0].split("_")[1];

  try {
    const stills = await getMovieStills(movieId);

    if (stills.length === 0) {
      await ctx.reply("Sorry, no preview images are available for this movie.");
      return;
    }

    await ctx.answerCallbackQuery();
    await new Promise(resolve => setTimeout(resolve, 500)); // Add a 500 ms delay

    const mediaGroup = stills.map((still, index) => ({
      type: "photo",
      media: still,
      caption: index === 0 ? "Here are some preview images from the movie." : undefined, // Add caption to the first photo
    } as InputMediaPhoto));

    await ctx.replyWithMediaGroup(mediaGroup, { reply_to_message_id: ctx.callbackQuery?.message?.message_id });
  } catch (error) {
    console.error("Error fetching movie stills:", error);
    await ctx.reply("Sorry, there was an error fetching preview images for this movie.");
  }
}

export { previewHandler };