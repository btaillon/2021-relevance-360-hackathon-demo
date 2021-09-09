import "./ResultList.scss";
import {
  FunctionComponent,
  RefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  buildResultList,
  buildResultsPerPage,
  ResultList as HeadlessResultList,
} from "@coveo/headless";
import EngineContext from "../common/engineContext";
import { MovieFields, MovieResult } from "../common/movie";
import { MovieModalContext } from "../common/movieModalContext";

interface ResultListProps {
  controller: HeadlessResultList;
}

const ResultListRenderer: FunctionComponent<ResultListProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);
  const { setCurrentMovie } = useContext(MovieModalContext);

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  return (
    <div className="wrapper">
      <div className="decoration list-background">
        <span className="decoration tape-edge"></span>
        <ul>
          {Array.from({ length: state.results.length + 2 }, (_, i) => (
            <li key={i} className="decoration fake-result"></li>
          ))}
        </ul>
        <span className="decoration tape-edge"></span>
      </div>
      <div className="list-results">
        <ul>
          {state.results
            .map((result) => result as MovieResult)
            .map((result) => (
              <li key={result.uniqueId}>
                <article>
                  <div className="thumbnail">
                    <img
                      src={result.raw.movieimage}
                      alt={`Thumbnail of ${result.title}`}
                    />
                  </div>
                  <h2>{result.title}</h2>
                  <div className="info">
                    <span className="release-date">
                      {result.raw.moviereleasedate
                        ? new Date(result.raw.moviereleasedate).getFullYear()
                        : ""}
                    </span>
                    <button
                      className="details-button"
                      onClick={() => setCurrentMovie(result)}
                    >
                      More details
                    </button>
                  </div>
                </article>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const ResultList: FunctionComponent<{ scrollTarget: RefObject<HTMLElement> }> =
  ({ scrollTarget }) => {
    const engine = useContext(EngineContext)!;
    buildResultsPerPage(engine, { initialState: { numberOfResults: 10 } });
    const controller = buildResultList(engine, {
      options: { fieldsToInclude: MovieFields },
    });

    const onScroll = () => {
      const scrollBottom =
        scrollTarget.current!.scrollTop + scrollTarget.current!.clientHeight;
      const hiddenSpaceAtBottom =
        scrollTarget.current!.scrollHeight - scrollBottom;
      if (
        hiddenSpaceAtBottom < 1000 &&
        !controller.state.isLoading &&
        controller.state.firstSearchExecuted &&
        controller.state.hasResults &&
        controller.state.moreResultsAvailable
      ) {
        controller.fetchMoreResults();
      }
    };

    useEffect(() => {
      scrollTarget.current!.addEventListener("scroll", onScroll);
    });

    return <ResultListRenderer controller={controller} />;
  };

export default ResultList;
