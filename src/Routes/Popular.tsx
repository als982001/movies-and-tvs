import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  API_KEY,
  emptyMovie,
  emptyTv,
  getPopularMovies,
  getPopularTvs,
  IGetMovieResult,
  IGetTvResult,
  IMovie,
  ITv,
} from "../api";
import { getMovieGenre, getTvGenre } from "../Components/genres";
import {
  AddIndexBtn,
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
  Loader,
  NoData,
  Overlay,
  Row,
  SimilarMovie,
  SimilarMovies,
  SimilarTitle,
  Slider,
  StandTitle,
  StandTitles,
  SubtractIndexBtn,
  Wrapper,
} from "../Components/Styles/mediaStyles";
import { boxVariants, rowVariants } from "../Components/Variants/mediaVariants";
import { makeImagePath } from "../utils";

const offset = 6;

export default function Popular() {
  const [clickedMovie, setClickedMovie] = useState<IMovie>();
  const [clickedTv, setClickedTv] = useState<ITv>();
  const [clickedMediaType, setClickedMediaType] = useState<string>("");
  const history = useHistory();

  const { scrollY } = useViewportScroll();

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const [similarMovies, setSimilarMovies] = useState<IGetMovieResult>();
  const [similarTvs, setSimilarTvs] = useState<IGetTvResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  const { data: popularMovies, isLoading: popularMoviesLoading } =
    useQuery<IGetMovieResult>("popularMovies", getPopularMovies);
  const { data: popularTvs, isLoading: popularTvsLoading } =
    useQuery<IGetTvResult>("popularTvs", getPopularTvs);

  const [moviesIndex, setMoviesIndex] = useState(0);
  const changeMoviesIndex = (plusIndex: boolean) => {
    if (popularMovies) {
      if (leaving) return;

      toggleLeaving();

      const totalMovies = popularMovies.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      if (plusIndex) {
        setMoviesIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setMoviesIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const [tvsIndex, setTvsIndex] = useState(0);
  const changeTvsIndex = (plusIndex: boolean) => {
    if (popularTvs) {
      if (leaving) return;

      toggleLeaving();

      const totalTvs = popularTvs.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;

      if (plusIndex) {
        setTvsIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setTvsIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const bigMovieMatch = useRouteMatch<{ mediaId: string }>(
    "/popular/movie/:mediaId"
  );
  const bigTvMatch = useRouteMatch<{ mediaId: string }>("/popular/tv/:mediaId");

  const onBoxClick = (mediaType: string, mediaId: number) => {
    if (mediaType === "movie") {
      const result = popularMovies.results.find(
        (movie) => movie.id === mediaId
      );

      setClickedMovie((prev) => result);
      setClickedMediaType(mediaType);

      history.push(`/popular/movie/${mediaId}`);
    } else if (mediaType === "tv") {
      const result = popularTvs.results.find((tv) => tv.id === mediaId);

      setClickedTv((prev) => result);
      setClickedMediaType(mediaType);

      history.push(`/popular/tv/${mediaId}`);
    }
  };

  const onOverlayClick = () => {
    setClickedMovie((prev) => emptyMovie);
    setClickedTv((prev) => emptyTv);
    setClickedMediaType((prev) => "");
    setSimilarLoading((prev) => true);
    history.push("/popular");
  };

  useEffect(() => {
    (async () => {
      if (clickedMovie || clickedTv) {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${
            clickedMovie.id || clickedTv.id
          }/similar?api_key=${API_KEY}`
        );
        const json = await response.json();

        if (clickedMediaType === "movie") {
          setSimilarMovies(json);
        } else {
          setSimilarTvs(json);
        }
        setSimilarLoading((prev) => false);
      }
    })();
  }, [clickedMovie, clickedTv]);

  return (
    <Wrapper>
      {popularMoviesLoading || popularTvsLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider style={{ marginTop: "200px" }}>
            <StandTitles>
              <StandTitle>Popular Movies</StandTitle>
              <AddIndexBtn onClick={() => changeMoviesIndex(true)}>
                ≫
              </AddIndexBtn>
              <SubtractIndexBtn onClick={() => changeMoviesIndex(false)}>
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
                  key={moviesIndex}
                >
                  {popularMovies.results
                    .slice(offset * moviesIndex, offset * moviesIndex + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                        onClick={() => onBoxClick("movie", movie.id)}
                      ></Box>
                    ))}
                </Row>
              </AnimatePresence>
            </DisplayStand>
          </Slider>
          <Slider style={{ marginTop: "500px" }}>
            <StandTitles>
              <StandTitle>Popular Tvs</StandTitle>
              <AddIndexBtn onClick={() => changeTvsIndex(true)}>≫</AddIndexBtn>
              <SubtractIndexBtn onClick={() => changeTvsIndex(false)}>
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
                  key={tvsIndex}
                >
                  {popularTvs.results
                    .slice(offset * tvsIndex, offset * tvsIndex + offset)
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                        onClick={() => onBoxClick("tv", tv.id)}
                      ></Box>
                    ))}
                </Row>
              </AnimatePresence>
            </DisplayStand>
          </Slider>
          {bigMovieMatch || bigTvMatch ? (
            <>
              <Overlay onClick={onOverlayClick} />
              <BigMovie
                style={{ top: scrollY.get() + 20 }}
                layoutId={
                  bigMovieMatch
                    ? bigMovieMatch.params.mediaId
                    : bigTvMatch.params.mediaId
                }
              >
                {clickedMovie || clickedTv ? (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                          clickedMovie.backdrop_path || clickedTv.backdrop_path,
                          "w500"
                        )})`,
                      }}
                    />
                    <BigAllInfos>
                      <BigSentenceInfos>
                        <BigMainInfos>
                          <BigMediaTitle
                            titleLength={
                              clickedMovie.title.length || clickedTv.name.length
                            }
                            style={{ fontWeight: "bold" }}
                          >
                            {clickedMovie.title || clickedTv.name}
                          </BigMediaTitle>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "300",
                            }}
                          >
                            {clickedMovie.overview || clickedTv.overview}
                          </p>
                        </BigMainInfos>
                        <BigOtherInfos>
                          {clickedMediaType === "movie"
                            ? clickedMovie.genre_ids.map((genreId) => (
                                <BigOtherInfo key={genreId}>
                                  {`● ${getMovieGenre(genreId)}`}
                                </BigOtherInfo>
                              ))
                            : clickedTv.genre_ids.map((genreId) => (
                                <BigOtherInfo key={genreId}>
                                  {`● ${getTvGenre(genreId)}`}
                                </BigOtherInfo>
                              ))}
                          <BigOtherInfo>
                            {clickedMediaType === "movie"
                              ? `Release Date: ${clickedMovie.release_date}`
                              : `First Air Date: ${clickedTv.first_air_date}`}
                          </BigOtherInfo>
                          <BigOtherInfo>
                            {`Popularity: ${
                              clickedMovie.popularity || clickedTv.popularity
                            }`}
                          </BigOtherInfo>
                          <BigOtherInfo>
                            {`Vote Average: ${
                              clickedMovie.vote_average ||
                              clickedTv.vote_average
                            }`}
                          </BigOtherInfo>
                        </BigOtherInfos>
                      </BigSentenceInfos>
                      <SimilarTitle>{`Similar ${clickedMediaType}s`}</SimilarTitle>
                      <SimilarMovies>
                        {similarLoading ? (
                          <p>아직은 보여줄 수 없다</p>
                        ) : (
                          <>
                            {clickedMediaType === "movie" ? (
                              similarMovies.results ? (
                                similarMovies.results
                                  .slice(0, 6)
                                  .map((s) => (
                                    <SimilarMovie
                                      key={s.id}
                                      bgphoto={makeImagePath(s.backdrop_path)}
                                    />
                                  ))
                              ) : (
                                <NoData>No Data</NoData>
                              )
                            ) : similarTvs.results ? (
                              similarTvs.results
                                .slice(0, 6)
                                .map((s) => (
                                  <SimilarMovie
                                    key={s.id}
                                    bgphoto={makeImagePath(s.backdrop_path)}
                                  />
                                ))
                            ) : (
                              <NoData>No Data</NoData>
                            )}
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
      )}
    </Wrapper>
  );
}
