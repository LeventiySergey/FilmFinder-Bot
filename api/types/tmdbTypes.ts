
export interface TMDbSearchResponse {
  results: Array<{
    id: number;
    title: string;
    // ...other properties...
  }>;
  // ...other properties...
}

export interface TMDbMovieDetails {
  id: number;
  tagline: string;
  poster_path: string;
  title: string;
  overview: string;
  genres: Array<{ id: number; name: string }>;
  release_date: string;
  vote_average: number;
  budget: number;
  runtime: number;
  credits: {
    cast: Array<{ id: number; name: string; character: string }>;
    crew: Array<{ id: number; name: string; job: string }>;
  };
  // ...other properties...
}
