import { MongoClient } from "npm:mongodb@5.6.0";
import { MyContext, User } from "../types.ts";
import { getMovieDetailsById } from "../api/tmdbApi.ts";
import { truncateTextExact } from "../handlers/byDescription.ts";

const MONGODB_URL = Deno.env.get("MONGODB_URL") || "mongodb://localhost:27017";
const client = new MongoClient(MONGODB_URL);

async function connectToDatabase() {
  await client.connect();
  const db = client.db("findfilmrobot");
  return db;
}

const db = await connectToDatabase();
export const favoritesCollection = db.collection("favorites");
export const usersCollection = db.collection<User>("users");

const SEARCH_LIMIT = 5;

export async function ensureUserExists(ctx: MyContext) {
  const userId = ctx.from?.id;
  const username = ctx.from?.username || "undefined username";
  const nickname = ctx.from?.first_name || "undefined nickname";
  const language = ctx.from?.language_code || "unknown";

  if (!userId) {
    console.error("User ID not found in context.");
    return;
  }

  try {
    const existingUser = await usersCollection.findOne({ userId });
    if (!existingUser) {
      await usersCollection.insertOne({
        userId,
        username,
        nickname,
        createdAt: new Date(),
        language,
        searchCount: 0,
        lastSearchDate: new Date().toISOString().split('T')[0],
      });
      console.log(`New user added: ${userId}`);
    }
  } catch (error) {
    console.error("Error ensuring user exists:", error);
  }
}

export async function checkAndUpdateSearchLimit(ctx: MyContext): Promise<boolean> {
  const userId = ctx.from?.id;
  if (!userId) return false;

  try {
    const user = await usersCollection.findOne({ userId });
    if (!user) return false;

    const currentDate = new Date().toISOString().split('T')[0];

    // Reset counter if it's a new day
    if (user.lastSearchDate !== currentDate) {
      await usersCollection.updateOne(
        { userId },
        { 
          $set: { 
            searchCount: 0,
            lastSearchDate: currentDate
          }
        }
      );
      user.searchCount = 0;
    }

    // Check if limit is exceeded
    if (user.searchCount >= SEARCH_LIMIT) {
      return false;
    }

    // Increment search counter
    await usersCollection.updateOne(
      { userId },
      { 
        $inc: { searchCount: 1 },
        $set: { lastSearchDate: currentDate }
      }
    );

    return true;
  } catch (error) {
    console.error("Error checking search limit:", error);
    return false;
  }
}

export async function getRemainingSearches(ctx: MyContext): Promise<number> {
  const userId = ctx.from?.id;
  if (!userId) return 0;

  try {
    const user = await usersCollection.findOne({ userId });
    if (!user) return 0;

    const currentDate = new Date().toISOString().split('T')[0];
    
    if (user.lastSearchDate !== currentDate) {
      return SEARCH_LIMIT;
    }

    return Math.max(0, SEARCH_LIMIT - user.searchCount);
  } catch (error) {
    console.error("Error getting remaining searches:", error);
    return 0;
  }
}

export async function addOrRemoveMovieFromDatabase(ctx: MyContext) {
  const data = ctx.match ? ctx.match[0].split("_") : null;
  if (!data || data.length < 2) {
    await ctx.reply("Invalid request format.");
    return;
  }
  const movieId = decodeURIComponent(data[1]);
  const movieDetails = await getMovieDetailsById(movieId);
  const movieName = truncateTextExact(movieDetails.title, 33);
  const userId = ctx.from?.id;

  if (!userId) {
    await ctx.reply("User ID not found.");
    return;
  }

  try {
    const existingFavorite = await favoritesCollection.findOne({ userId, movieName });
    if (existingFavorite) {
      await favoritesCollection.deleteOne({ userId, movieName });
      await ctx.reply(`Removed this movie from your favorites.`);
    } else {
      await favoritesCollection.insertOne({ userId, movieName });
      await ctx.reply(`Added this movie to your favorites.`);
    }
  } catch (error) {
    console.error("Error updating favorites:", error);
    await ctx.reply("Sorry, there was an error updating your favorites.");
  }
}

export async function getFavoriteMovies(userId: number) {
  try {
    const favorites = await favoritesCollection.find({ userId }).toArray();
    return favorites.map(favorite => favorite.movieName);
  } catch (error) {
    console.error("Error fetching favorite movies:", error);
    return [];
  }
}
