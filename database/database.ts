import { MongoClient } from "npm:mongodb@5.6.0";
import { MyContext } from "../types.ts";
import { getMovieDetailsById } from "../api/tmdbApi.ts";

const client = new MongoClient("mongodb://localhost:27017");

async function connectToDatabase() {
  await client.connect();
  const db = client.db("findfilmrobot");
  return db;
}

const db = await connectToDatabase();
export const usersCollection = db.collection("favorites");

export async function addOrRemoveMovieFromDatabase(ctx: MyContext) {
  const data = ctx.match ? ctx.match[0].split("_") : null;
  if (!data || data.length < 2) {
    await ctx.reply("Invalid request format.");
    return;
  }
  const movieId = data[1];
  const movieDetails = await getMovieDetailsById(movieId);
  const movieName = movieDetails.title;
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  try {
    const existingFavorite = await usersCollection.findOne({ userId, movieName });
    if (existingFavorite) {
      await usersCollection.deleteOne({ userId, movieName });
      await ctx.reply(`"${movieName}" has been removed from your favorites. Hope it wasn't a tough decision!`);
        } else {
      await usersCollection.insertOne({ userId, movieName });
      await ctx.reply(`"${movieName}" has been added to your favorites. Enjoy your movie time!`);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
    await ctx.reply("Sorry, there was an error updating your favorites.");
  }
}

export async function getFavoriteMovies(userId: number) {
  try {
    const favorites = await usersCollection.find({ userId }).toArray();
    return favorites.map(favorite => favorite.movieName);
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return [];
  }
}
