import { useViewportScroll, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { API_KEY, IGetMovieResult, IMovie } from "../../api";
import { makeImagePath } from "../../utils";
import { getMovieGenre } from "../../Components/genres";

interface IBigMovie {
  movieType: string;
  clickedMovie: IMovie;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 5;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 150vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  border: 1px solid #f8ede3;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 20px 10px black;
  z-index: 10;
`;

const BigCover = styled.div`
  width: 100%;
  flex: 4 0 0;
  background-size: cover;
  background-position: center center;
`;

const BigAllInfos = styled.section`
  width: 100%;
  flex: 6 0 0;
  display: flex;
  flex-direction: column;
`;

const BigSentenceInfos = styled.section`
  width: 100%;
  height: 40%;
  display: flex;
`;

const BigMainInfos = styled.section`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  padding-top: 0px;
  justify-content: center;
  padding: 0 10px;
`;

const BigOtherInfos = styled.section`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding-left: 20px;
`;

const BigOtherInfo = styled.span`
  font-size: 15px;
  margin: 1px 0;
`;

const SimilarMovies = styled.section`
  width: 100%;
  height: 60%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: relative;
`;

const SimilarTitle = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin: 0 auto;
`;

const SimilarMovie = styled.section<{ bgphoto: string }>`
  border: 1px black solid;
  border-radius: 10px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
`;

const BigMediaTitle = styled.h1<{ titleLength: number }>`
  fontweight: "bold";
  font-size: ${(props) => (props.titleLength > 20 ? "25px" : "35px")};
  margin-bottom: 5px;
`;

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
