import { Result } from "@coveo/headless";

type Raw = Result["raw"];

interface MovieResultRaw extends Raw {
  moviedirector?: string[];
  movieactors?: string[];
  movielanguage?: string[];
  movietags?: string[];
  moviegenre?: string[];
  movieimage?: string;
  moviereleasedate?: number;
  moviescore?: number;
  movieviewrating?: number;
  objecttype?: "Movie" | "Series";
}

export interface MovieResult extends Result {
  raw: MovieResultRaw;
}

export const MovieFields = [
  "moviedirector",
  "movieactors",
  "movieimage",
  "moviereleasedate",
  "moviescore",
  "movieviewrating",
  "movielanguage",
  "movietags",
  "moviegenre",
  "objecttype",
];
