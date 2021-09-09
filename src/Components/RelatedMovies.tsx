import {
  buildResultList,
  buildTab,
  ResultList,
  SearchEngine,
} from "@coveo/headless";
import { useContext, useEffect, useState } from "react";
import { FunctionComponent } from "react";
import { initializeHeadlessEngine } from "../common/Engine";
import { MovieFields, MovieResult } from "../common/movie";
import { MovieModalContext } from "../common/movieModalContext";
import "./RelatedMovies.scss";

function getRelatedExpression(movie: MovieResult) {
  const movieGenres = (movie.raw.moviegenre ?? [])
    .map((genre) => `"${genre}"`)
    .join(",");
  return `@moviegenre==(${movieGenres}) NOT @clickUri=="${movie.clickUri}"`;
}

const RelatedMoviesRenderer: FunctionComponent<{ controller: ResultList }> = ({
  controller,
}) => {
  const [movies, setMovies] = useState<MovieResult[] | null>(null);
  const { setCurrentMovie } = useContext(MovieModalContext);

  useEffect(
    () =>
      controller.subscribe(() =>
        setMovies(controller.state.results as MovieResult[])
      ),
    [controller]
  );

  return (
    <ul className="related-movies">
      {movies
        ? movies.map((movie) => (
            <li key={movie.uniqueId} onClick={() => setCurrentMovie(movie)}>
              <img src={movie.raw.movieimage} alt={movie.title} />
            </li>
          ))
        : Array.from({ length: 10 }, (_, i) => (
            <li key={i}>
              <div className="decoration fake-thumbnail"></div>
            </li>
          ))}
    </ul>
  );
};

export const RelatedMovies: FunctionComponent<{ movie: MovieResult }> = ({
  movie,
}) => {
  const [engine, setEngine] = useState<SearchEngine | null>(null);

  if (!engine) {
    initializeHeadlessEngine().then((e) => setEngine(e));
    return null;
  }

  buildTab(engine, {
    options: { id: "genreIsSame", expression: getRelatedExpression(movie) },
    initialState: { isActive: true },
  });

  engine.executeFirstSearch();

  const controller = buildResultList(engine, {
    options: { fieldsToInclude: MovieFields },
  });

  return (
    <RelatedMoviesRenderer controller={controller}></RelatedMoviesRenderer>
  );
};
