const TMDB_API_URL = "https://api.themoviedb.org/3";
const API_KEY = Deno.env.get("TMDB_API_KEY")!; // Read API key from environment variables

/**
 * Function to search for a movie by title and get its detailed information
 * @param title - Movie title
 * @returns Detailed information about the movie
 */
export async function getMovieDetails(title: string): Promise<any> {
  try {
    // Search for the movie by title
    const searchResponse = await fetch(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(title)}&api_key=${API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!searchResponse.ok) {
      console.error("Error searching for the movie:", await searchResponse.text());
      throw new Error(`TMDb API returned status ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (searchData.results.length === 0) {
      throw new Error("Movie not found.");
    }

    // Assume the first result is the most relevant
    const movieId = searchData.results[0].id;

    // Get detailed information about the movie
    const detailsResponse = await fetch(
      `${TMDB_API_URL}/movie/${movieId}?api_key=${API_KEY}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!detailsResponse.ok) {
      console.error("Error getting movie details:", await detailsResponse.text());
      throw new Error(`TMDb API returned status ${detailsResponse.status}`);
    }

    const movieDetails = await detailsResponse.json();
    return movieDetails;
  } catch (error) {
    console.error("Error accessing TMDb API:", error);
    throw new Error("Failed to get movie information from TMDb API.");
  }
}

/**
 * Function to get detailed information about a movie by its ID
 * @param movieId - Movie ID
 * @returns Detailed information about the movie
 */
export async function getMovieDetailsById(movieId: string): Promise<any> {
  try {
    const detailsResponse = await fetch(
      `${TMDB_API_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!detailsResponse.ok) {
      console.error("Error getting movie details:", await detailsResponse.text());
      throw new Error(`TMDb API returned status ${detailsResponse.status}`);
    }

    const movieDetails = await detailsResponse.json();
    return movieDetails;
  } catch (error) {
    console.error("Error accessing TMDb API:", error);
    throw new Error("Failed to get movie information from TMDb API.");
  }
}
