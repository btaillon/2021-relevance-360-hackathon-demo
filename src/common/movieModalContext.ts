import { createContext } from "react";
import { MovieResult } from "./movie";

export interface MovieModalContextDefinition {
  currentMovie: MovieResult | null;
  setCurrentMovie: (movie: MovieResult | null) => void;
}

export const MovieModalContext = createContext<MovieModalContextDefinition>({
  currentMovie: null,
  setCurrentMovie: () => {},
});
