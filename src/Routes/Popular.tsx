import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import styled from "styled-components";
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
  Display,
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
import { infoVariants } from "../Components/Styles/searchStyles";

export const TBox = styled(motion.div)<{ bgphoto: string }>`
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

export const TInfos = styled(motion.section)`
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

export const TInfo = styled.div`
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
            </StandTitles>
            <div>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Display>
                  {popularMovies.results.slice(0, 18).map((movie) => (
                    <TBox
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      onClick={() => onBoxClick("movie", movie.id)}
                    >
                      <TInfos variants={infoVariants}>
                        <TInfo
                          style={{
                            width: "50%",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                        >
                          {movie.title}
                        </TInfo>
                        <TInfo style={{ width: "30%" }}>
                          <span>{`🏳️: ${movie.original_language}`}</span>
                          <span>{`Score: ${movie.popularity}`}</span>
                        </TInfo>
                      </TInfos>
                    </TBox>
                  ))}
                </Display>
              </AnimatePresence>
            </div>
          </Slider>
          <Slider>
            <StandTitles>
              <StandTitle>Popular Tvs</StandTitle>
            </StandTitles>
            <div>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Display>
                  {popularTvs.results.slice(0, 18).map((tv) => (
                    <TBox
                      layoutId={tv.id + ""}
                      key={tv.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                      onClick={() => onBoxClick("tv", tv.id)}
                    >
                      <TInfos variants={infoVariants}>
                        <TInfo
                          style={{
                            width: "50%",
                            fontSize: "15px",
                            fontWeight: "bold",
                          }}
                        >
                          {tv.name}
                        </TInfo>
                        <TInfo style={{ width: "30%" }}>
                          <span>{`🏳️: ${tv.origin_country}`}</span>
                          <span>{`Score: ${tv.popularity}`}</span>
                        </TInfo>
                      </TInfos>
                    </TBox>
                  ))}
                </Display>
              </AnimatePresence>
            </div>
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
