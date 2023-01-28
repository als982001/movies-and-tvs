import { useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  BigAllInfos,
  BigCover,
  BigMainInfos,
  BigMediaTitle,
  BigMovie,
  BigOtherInfo,
  BigOtherInfos,
  BigSentenceInfos,
  Overlay,
  SimilarMovie,
  SimilarMovies,
  SimilarTitle,
} from "../../Components/Styles/mediaStyles";
import { API_KEY, IGetMovieResult, IMovie } from "../../api";
import { makeImagePath } from "../../utils";
import { click } from "@testing-library/user-event/dist/click";
import { getMovieGenre } from "../../Components/genres";

interface IBigMovie {
  movieType: string;
  clickedMovie: IMovie;
}

export const emptyMovie: IMovie = {
  poster_path: "",
  adult: false,
  overview: "",
  release_date: "",
  genre_ids: [0],
  id: 0,
  original_title: "",
  original_language: "",
  title: "",
  backdrop_path: "",
  popularity: 0,
  vote_average: 0,
  video: false,
  vote_count: 0,
};

export default function ClickedBigMovie({
  movieType,
  clickedMovie,
}: IBigMovie) {
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const [similar, setSimilar] = useState<IGetMovieResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  const onOverlayClick = () => {
    setSimilarLoading((prev) => true);
    history.push("/movies");
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${clickedMovie.id}/similar?api_key=${API_KEY}`
      );
      const json = await response.json();
      setSimilar(json);
      setSimilarLoading((prev) => false);
    })();
  });

  return (
    <>
      <Overlay onClick={onOverlayClick} />
      <BigMovie
        style={{ top: scrollY.get() + 20 }}
        layoutId={bigMovieMatch.params.movieId + movieType}
      >
        {clickedMovie ? (
          <>
            <BigCover
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  clickedMovie.backdrop_path,
                  "w500"
                )})`,
              }}
            />
            <BigAllInfos>
              <BigSentenceInfos>
                <BigMainInfos>
                  <BigMediaTitle
                    titleLength={clickedMovie.title.length}
                    style={{ fontWeight: "bold" }}
                  >
                    {clickedMovie.title}
                  </BigMediaTitle>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: "300",
                    }}
                  >
                    {clickedMovie.overview.length > 300
                      ? clickedMovie.overview.slice(0, 300) + "..."
                      : clickedMovie.overview}
                  </p>
                </BigMainInfos>
                <BigOtherInfos>
                  {clickedMovie.genre_ids.map((genreId) => (
                    <BigOtherInfo key={genreId}>
                      {`● ${getMovieGenre(genreId)}`}
                    </BigOtherInfo>
                  ))}
                  <BigOtherInfo>
                    {`Release Date: ${clickedMovie.release_date}`}
                  </BigOtherInfo>
                  <BigOtherInfo>
                    {`Popularity: ${clickedMovie.popularity}`}
                  </BigOtherInfo>
                  <BigOtherInfo>
                    {`Vote Average: ${clickedMovie.vote_average}`}
                  </BigOtherInfo>
                </BigOtherInfos>
              </BigSentenceInfos>
              <SimilarTitle>Similar Movies</SimilarTitle>
              <SimilarMovies>
                {similarLoading ? (
                  <p>아직은 보여줄 수 없다.</p>
                ) : (
                  <>
                    {similar.results
                      ? similar.results
                          .slice(0, 6)
                          .map((s) => (
                            <SimilarMovie
                              key={s.id}
                              bgphoto={makeImagePath(s.backdrop_path)}
                            />
                          ))
                      : null}
                  </>
                )}
              </SimilarMovies>
            </BigAllInfos>
          </>
        ) : null}
      </BigMovie>
    </>
  );
}
