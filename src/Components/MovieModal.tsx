import "./MovieModal.scss";
import CloseIcon from "../icons/close.svg";
import { FunctionComponent, useContext } from "react";
import { MovieResult } from "../common/movie";
import { Icon } from "./Icon";
import { MovieModalContext } from "../common/movieModalContext";
import { addSpacesToSpacelessTitle } from "../utils/string";
import { RelatedMovies } from "./RelatedMovies";

export const MovieModal: FunctionComponent<{ movie: MovieResult }> = ({
  movie,
}) => {
  const { setCurrentMovie } = useContext(MovieModalContext);

  const closeModal = () => setCurrentMovie(null);

  const renderSimpleRow = (label: string, fieldValue: string | undefined) => (
    <tr>
      <th>{label}</th>
      <td>
        <ul>{fieldValue ?? "None"}</ul>
      </td>
    </tr>
  );

  const renderListRow = (label: string, fieldValue: string[] | undefined) => (
    <tr>
      <th>{label}</th>
      <td>
        <ul>
          {(fieldValue ?? []).map((subValue) => (
            <li key={subValue}>{addSpacesToSpacelessTitle(subValue)}</li>
          ))}
        </ul>
      </td>
    </tr>
  );

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="modal">
        <div className="modal-title">
          <button onClick={closeModal}>
            <Icon icon={CloseIcon}></Icon>
          </button>
        </div>
        <div className="modal-content">
          <img
            className="thumbnail"
            src={movie.raw.movieimage}
            alt={`Thumbnail of ${movie.title}`}
          />
          <div className="info">
            <h1>{movie.title}</h1>
            <h2>Details</h2>
            <table>
              <tbody>
                {renderSimpleRow("Type", movie.raw.objecttype)}
                {renderSimpleRow(
                  "Release date",
                  movie.raw.moviereleasedate
                    ? new Date(movie.raw.moviereleasedate).toLocaleDateString()
                    : "Unknown"
                )}
                {renderSimpleRow(
                  "Rating",
                  movie.raw.moviescore
                    ? movie.raw.moviescore.toString()
                    : "Unknown"
                )}
                {renderListRow("Directors", movie.raw.moviedirector)}
                {renderListRow("Lead actors", movie.raw.movieactors)}
                {renderListRow("Genre", movie.raw.moviegenre)}
                {renderListRow("Languages", movie.raw.movielanguage)}
                {renderListRow("Tags", movie.raw.movietags)}
              </tbody>
            </table>
            <h2>Related movies</h2>
            <div className="related-movies-wrapper">
              <RelatedMovies key={movie.uniqueId} movie={movie}></RelatedMovies>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
