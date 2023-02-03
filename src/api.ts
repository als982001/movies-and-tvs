export const API_KEY = "cb5ff8ff66f9c05c5e1f5fd2602e7603";
const BASE_PATH = "https://api.themoviedb.org/3";
export const YOUTUBE_PATH = "https://www.youtube.com/embed/";
export const NO_CONTROL = "?controls=0&autohide=1";

export interface ILatestMovie {
  adult: boolean;
  backdrop_path: string | null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  original_language: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface IMovie {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_average: number;
  video: boolean;
  vote_count: number;
}

export interface ITv {
  poster_path: string;
  popularity: number;
  id: number;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  first_air_date: string;
  origin_country: string[];
  genre_ids: number[];
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

export interface IGetMovieResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface ILatestTv {
  backdrop_path: string | null;
  episode_run_time: number[];
  first_air_date: string;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  network: { id: number; name: string }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string | null;
  popularity: number;
  poster_path: string | null;
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    poster_path: string | null;
    season_number: number;
  }[];
  status: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

export interface ISearch {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  media_type: string;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  first_air_date: string;
  title: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

export interface ISearchResult {
  results: ISearch[];
  total_results: number;
  total_pages: number;
}

export const getNowPlayingMovies = async () => {
  const response = await fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
  );
  const json = response.json();

  return json;
};

export function getNowPlayingMovies02() {
  // https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getTopRatedMovies() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getUpcomingMovies() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export const getPopularMovies = async () => {
  console.log(`흑흑흑1!!!! ${BASE_PATH}/movie/popular?api_key=${API_KEY}`);

  const response = await fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`);
  const json = response.json();

  return json;
};

export function getLatestMovie() {
  return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function getMovieDetail(movieId: number) {
  return fetch(`${BASE_PATH}/movie/${movieId}}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// 여기부터는 TV

export function getOnAirTvs() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (Response) => Response.json()
  );
}

export function getTopRatedTvs() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (Response) => Response.json()
  );
}

export function getPopularTvs() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((Response) =>
    Response.json()
  );
}

export function getAiringTodayTvs() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (Response) => Response.json()
  );
}

export function getLatestTv() {
  return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

export function getSearchTvs() {
  return fetch(`${BASE_PATH}/tv/{tv_id}/keywords?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export function SearchKeyword(keyword: any) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}&page=1&include_adult=false`
  ).then((response) => response.json());
}
