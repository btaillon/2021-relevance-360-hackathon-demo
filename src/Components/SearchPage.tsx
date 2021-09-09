import "./SearchPage.scss";
import React, { createRef, useEffect, useState } from "react";
import {
  buildSearchStatus,
  loadSearchActions,
  SearchEngine,
} from "@coveo/headless";
import { EngineProvider } from "../common/engineContext";
import ResultList from "./ResultList";
import SearchBox from "./SearchBox";
import FacetDropdown from "./FacetDropdown";
import { MovieResult } from "../common/movie";
import { MovieModalContext } from "../common/movieModalContext";
import { MovieModal } from "./MovieModal";

interface ISearchPageProps {
  engine: SearchEngine;
}

const SearchPage: React.FunctionComponent<ISearchPageProps> = (props) => {
  const { engine } = props;
  const mainRef = createRef<HTMLElement>();
  useEffect(() => {
    engine.executeFirstSearch();
  }, [engine]);

  const [currentMovie, setCurrentMovie] = useState<MovieResult | null>(null);

  return (
    <EngineProvider value={engine}>
      <MovieModalContext.Provider value={{ currentMovie, setCurrentMovie }}>
        {currentMovie && <MovieModal movie={currentMovie}></MovieModal>}
        <main
          ref={mainRef}
          className={currentMovie ? "modal-open" : "modal-closed"}
        >
          <div className="searchbox-area">
            <div className="vertical-stack">
              <SearchBox></SearchBox>
              <div className="dropdowns">
                <FacetDropdown
                  field="moviegenre"
                  defaultLabel="Any genre"
                ></FacetDropdown>
                <FacetDropdown
                  field="movielanguage"
                  defaultLabel="Any language"
                ></FacetDropdown>
              </div>
            </div>
          </div>
          <div className="results-area">
            <ResultList scrollTarget={mainRef}></ResultList>
          </div>
        </main>
      </MovieModalContext.Provider>
    </EngineProvider>
  );
};

export default SearchPage;
