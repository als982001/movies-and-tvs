import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getTopRatedMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
  IGetMovieResult,
  IMovie,
  API_KEY,
  getPopularMovies,
} from "../../api";
import { getMovieGenre } from "../../Components/genres";
import { makeImagePath } from "../../utils";

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  margin-top: 50px;
`;

const Wrapper = styled.div`
  position: relative;
  top: -100px;
  margin-bottom: 100px;
`;

const Display = styled.section`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
`;

const StandTitles = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
`;

const StandTitle = styled.h2`
  font-size: 39px;
  font-weight: bold;
  margin-left: 50px;
  margin-bottom: 20px;
  margin-right: 80px;
`;

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

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  height: 200px;
  border-radius: 20px;

  box-shadow: 3px 3px 2px 1px #d8d8d8, -3px 3px 2px 1px #d8d8d8;
  &:first-child,
  &:nth-child(7),
  &:nth-child(13) {
    transform-origin: center left;
  }

  &:last-child,
  &:nth-child(6),
  &:nth-child(12) {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Infos = styled(motion.section)`
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 35%;
  bottom: 0;
  border-radius: 0 0 20px 20px;

  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const Info = styled.div`
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-radius: 20%;
  font-weight: bold;
  span {
    font-size: 10px;
  }
`;

interface IMovieType {
  movieType: string;
  page: string;
}

const emptyMovie: IMovie = {
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

const typeTitle = (type: string): string => {
  if (type === "nowPlaying") return "Now Playing";
  if (type === "topRated") return "Top Rated";
  if (type === "popular") return "Popular Movies";
  if (type === "upcoming") return "Upcoming";

  return null;
};

export default function Movie({ movieType, page }: IMovieType) {
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>(`/${page}/:movieId`);
  const [clickedMovie, setClickedMovie] = useState<IMovie>(emptyMovie);
  const [clicked, setClicked] = useState(false);
  const [similar, setSimilar] = useState<IGetMovieResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  const { data, isLoading } = useQuery<IGetMovieResult>(
    movieType,
    movieType === "nowPlaying"
      ? getNowPlayingMovies
      : movieType === "topRated"
      ? getTopRatedMovies
      : movieType === "popular"
      ? getPopularMovies
      : getUpcomingMovies
  );

  const onBoxClick = (movie: IMovie) => {
    setClickedMovie(movie);
    setClicked((prev) => true);

    history.push(`/${page}/${movie.id}`);
  };

  const onOverlayClick = () => {
    setSimilarLoading((prev) => true);
    setClicked((prev) => false);

    history.push(`/${page}`);
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
  }, [clickedMovie]);

  return (
    typeTitle(movieType) && (
      <>
        <Wrapper>
          <StandTitles>
            <StandTitle>{typeTitle(movieType)}</StandTitle>
          </StandTitles>
          {isLoading ? (
            <Loader>Loading,,,</Loader>
          ) : (
            <div>
              <AnimatePresence>
                <Display>
                  {data.results
                    .slice(1)
                    .slice(0, 18)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + movieType}
                        key={movie.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path)}
                        onClick={() => onBoxClick(movie)}
                      >
                        <Infos variants={infoVariants}>
                          <Info
                            style={{
                              width: "50%",
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            {movie.title}
                          </Info>
                          <Info style={{ width: "30%" }}>
                            <span>{`🏳️: ${movie.original_language}`}</span>
                            <span>{`Score: ${movie.popularity}`}</span>
                          </Info>
                        </Infos>
                      </Box>
                    ))}
                </Display>
              </AnimatePresence>
            </div>
          )}
        </Wrapper>
        {bigMovieMatch && clicked ? (
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
        ) : null}
      </>
    )
  );
}
