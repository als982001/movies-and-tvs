import { useQuery } from "react-query";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  API_KEY,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMovieResult,
  IMovie,
  emptyMovie,
} from "../../api";
import {
  AddIndexBtn,
  Banner,
  BigAllInfos,
  BigCover,
  BigMainInfos,
  BigMediaTitle,
  BigMovie,
  BigOtherInfo,
  BigOtherInfos,
  BigSentenceInfos,
  Box,
  DisplayStand,
  Info,
  InfoBtn,
  InfoBtns,
  InfoGenre,
  InfoGenres,
  InfoLeftBtns,
  InfoSentences,
  InfoTitle,
  Loader,
  Overlay,
  Overview,
  Row,
  SimilarMovie,
  SimilarMovies,
  SimilarTitle,
  Slider,
  StandTitle,
  StandTitles,
  SubtractIndexBtn,
  Title,
  Wrapper,
} from "../../Components/Styles/mediaStyles";
import { makeImagePath } from "../../utils";
import {
  boxVariants,
  infoVariants,
  rowVariants,
} from "../../Components/Variants/mediaVariants";
import { movieGenres, getMovieGenre } from "../../Components/genres";
import { click } from "@testing-library/user-event/dist/click";

const offset = 6;

export default function Movies() {
  const [clickedMovie, setClickedMovie] = useState<IMovie>(emptyMovie);
  const [clickedMovieType, setClickedMovieType] = useState<string>("");

  const { scrollY } = useViewportScroll();
  const history = useHistory();

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const { data: nowPlaying, isLoading: nowPlayingLoading } =
    useQuery<IGetMovieResult>(["movies", "nowPlaying"], getNowPlayingMovies);
  const { data: upcoming, isLoading: upcomingLoading } =
    useQuery<IGetMovieResult>(["movies", "upcoming"], getUpcomingMovies);
  const { data: topRated, isLoading: topRatedLoading } =
    useQuery<IGetMovieResult>(["movies", "topRated"], getTopRatedMovies);

  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const changeNowPlayingIndex = (plusIndex: boolean) => {
    if (nowPlaying) {
      if (leaving) return;

      toggleLeaving();

      const totalMovies = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      if (plusIndex === true) {
        setNowPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setNowPlayingIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const changeUpcomingIndex = (plusIndex: boolean) => {
    if (upcoming) {
      if (leaving) return;

      toggleLeaving();

      const totalMovies = upcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      if (plusIndex === true) {
        setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setUpcomingIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const changeTopRatedIndex = (plusIndex: boolean) => {
    if (topRated) {
      if (leaving) return;

      toggleLeaving();

      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      if (plusIndex === true) {
        setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setTopRatedIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const onOverlayClick = () => {
    setClickedMovie(emptyMovie);
    setClickedMovieType("");
    setSimilarLoading((prev) => true);
    history.push("/movies");
  };
  const onBoxClicked = (type: string, movieId: number) => {
    let result = emptyMovie;

    if (type === "nowPlaying") {
      result = nowPlaying.results.find((movie) => movie.id === movieId);
    } else if (type === "upcoming") {
      result = upcoming.results.find((movie) => movie.id === movieId);
    } else if (type === "topRated") {
      result = topRated.results.find((movie) => movie.id === movieId);
    }
    setClickedMovie(result);
    setClickedMovieType(type);

    history.push(`/movies/${movieId}`);
  };

  const [similar, setSimilar] = useState<IGetMovieResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (clickedMovie) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${clickedMovie.id}/similar?api_key=${API_KEY}`
        );
        const json = await response.json();
        setSimilar(json);
        setSimilarLoading((prev) => false);
      }
    })();
  }, [clickedMovie]);

  return (
    <Wrapper>
      {nowPlayingLoading || upcomingLoading || topRatedLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(nowPlaying.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying.results[0].title}</Title>
            <Overview>{nowPlaying.results[0].overview}</Overview>
          </Banner>
          <>
            <Slider>
              <StandTitles>
                <StandTitle>Now Playing</StandTitle>
                <AddIndexBtn onClick={() => changeNowPlayingIndex(true)}>
                  ≫
                </AddIndexBtn>
                <SubtractIndexBtn onClick={() => changeNowPlayingIndex(false)}>
                  ≪
                </SubtractIndexBtn>
              </StandTitles>
              <DisplayStand>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={nowPlayingIndex}
                  >
                    {nowPlaying.results
                      .slice(1)
                      .slice(
                        offset * nowPlayingIndex,
                        offset * nowPlayingIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "nowPlaying"}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path)}
                          onClick={() => onBoxClicked("nowPlaying", movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <InfoBtns>
                              <InfoLeftBtns>
                                <InfoBtn>▶</InfoBtn>
                                <InfoBtn>+</InfoBtn>
                                <InfoBtn>👍🏻</InfoBtn>
                              </InfoLeftBtns>
                              <InfoBtn>∨</InfoBtn>
                            </InfoBtns>
                            <InfoSentences>
                              <InfoTitle>{movie.title}</InfoTitle>
                              <InfoGenres>
                                {movie.genre_ids.slice(0, 3).map((genreId) => (
                                  <InfoGenre key={genreId}>
                                    {`● ${getMovieGenre(genreId)}`}
                                  </InfoGenre>
                                ))}
                              </InfoGenres>
                            </InfoSentences>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </DisplayStand>
            </Slider>
            <Slider style={{ marginTop: "500px" }}>
              <StandTitles>
                <StandTitle>Upcoming</StandTitle>
                <AddIndexBtn onClick={() => changeUpcomingIndex(true)}>
                  ≫
                </AddIndexBtn>
                <SubtractIndexBtn onClick={() => changeUpcomingIndex(false)}>
                  ≪
                </SubtractIndexBtn>
              </StandTitles>
              <DisplayStand>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={upcomingIndex}
                  >
                    {upcoming.results
                      .slice(
                        offset * upcomingIndex,
                        offset * upcomingIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "upcoming"}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path)}
                          onClick={() => onBoxClicked("upcoming", movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <InfoBtns>
                              <InfoLeftBtns>
                                <InfoBtn>▶</InfoBtn>
                                <InfoBtn>+</InfoBtn>
                                <InfoBtn>👍🏻</InfoBtn>
                              </InfoLeftBtns>
                              <InfoBtn>∨</InfoBtn>
                            </InfoBtns>
                            <InfoSentences>
                              <InfoTitle>{movie.title}</InfoTitle>
                              <InfoGenres>
                                {movie.genre_ids.slice(0, 3).map((genreId) => (
                                  <InfoGenre key={genreId}>
                                    {`● ${getMovieGenre(genreId)}`}
                                  </InfoGenre>
                                ))}
                              </InfoGenres>
                            </InfoSentences>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </DisplayStand>
            </Slider>
            <Slider style={{ marginTop: "500px" }}>
              <StandTitles>
                <StandTitle>Top Rated</StandTitle>
                <AddIndexBtn onClick={() => changeTopRatedIndex(true)}>
                  ≫
                </AddIndexBtn>
                <SubtractIndexBtn onClick={() => changeTopRatedIndex(false)}>
                  ≪
                </SubtractIndexBtn>
              </StandTitles>
              <DisplayStand>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Row
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ type: "tween", duration: 1 }}
                    key={topRatedIndex}
                  >
                    {topRated.results
                      .slice(
                        offset * topRatedIndex,
                        offset * topRatedIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + "topRated"}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path)}
                          onClick={() => onBoxClicked("topRated", movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <InfoBtns>
                              <InfoLeftBtns>
                                <InfoBtn>▶</InfoBtn>
                                <InfoBtn>+</InfoBtn>
                                <InfoBtn>👍🏻</InfoBtn>
                              </InfoLeftBtns>
                              <InfoBtn>∨</InfoBtn>
                            </InfoBtns>
                            <InfoSentences>
                              <InfoTitle>{movie.title}</InfoTitle>
                              <InfoGenres>
                                {movie.genre_ids.slice(0, 3).map((genreId) => (
                                  <InfoGenre key={genreId}>
                                    {`● ${getMovieGenre(genreId)}`}
                                  </InfoGenre>
                                ))}
                              </InfoGenres>
                            </InfoSentences>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </DisplayStand>
            </Slider>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayClick} />
                <BigMovie
                  style={{ top: scrollY.get() + 20 }}
                  layoutId={bigMovieMatch.params.movieId + clickedMovieType}
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
                            <p>아직은 보여줄 수 없다</p>
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
        </>
      )}
    </Wrapper>
  );
}
