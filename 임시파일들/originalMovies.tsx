import { useQuery } from "react-query";
import { AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getMovies,
  IGetMovieResult,
  getTopMovies,
  getUpcomingMovies,
  getLatestMovie,
  ILatestMovie,
} from "../api";
import { makeImagePath } from "../utils";
import { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  Wrapper,
  Loader,
  Banner,
  Title,
  Overview,
  Info,
  Overlay,
  BigMovie,
  BigCover,
  BigTitle,
  BigOverview,
  Slider,
  Row,
  Box,
  StandTitles,
  DisplayStand,
  ShowMore,
  BigInfo,
  BigOtherInfos,
  BigOtherInfo,
  LatestDiv,
  YesCover,
  LatestInfo,
  LatestTitle,
  LatestOverview,
  NoCover,
  StandTitle,
} from "../../Components/Styles/mediaStyles";
import { boxVariants, infoVariants, rowVariants } from "../Components/variants";

const offset = 6;

function Home() {
  const history = useHistory();
  const onBoxClicked = (movieId: number) => history.push(`/movies/${movieId}`);

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOverlayClick = () => history.push("/");

  const { scrollY } = useViewportScroll();

  const { data: nowData, isLoading: nowLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: upcoming, isLoading: upcomingLoading } =
    useQuery<IGetMovieResult>(["movies", "upcoming"], getUpcomingMovies);
  const { data: topRated, isLoading: topRatedLoading } =
    useQuery<IGetMovieResult>(["movies", "topRated"], getTopMovies);
  const { data: latest, isLoading: latestLoading } = useQuery<ILatestMovie>(
    ["movies", "latest"],
    getLatestMovie
  );

  const [upcomingIndex, setUpcomingIndex] = useState(0);
  const increaseUpcomingIndex = () => {
    if (upcoming) {
      if (leaving) return;

      toggleLeaving();

      const totalMovies = upcoming.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const increaseTopRatedIndex = () => {
    if (topRated) {
      if (leaving) return;

      toggleLeaving();

      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;

      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const clickedMovie = () => {
    if (bigMovieMatch?.params.movieId) {
      let findResult = upcoming?.results.find(
        (movie) => movie.id === +bigMovieMatch.params.movieId
      );

      if (findResult === undefined) {
        findResult = topRated?.results.find(
          (movie) => movie.id === +bigMovieMatch.params.movieId
        );
      }

      return findResult;
    }
  };

  return (
    <Wrapper>
      {nowLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
          </Banner>
          <>
            <Slider>
              <StandTitles>
                <StandTitle>개봉 예정작</StandTitle>
                <ShowMore onClick={increaseUpcomingIndex}>
                  <span>더보기</span>
                </ShowMore>
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
                    {upcoming?.results
                      .slice(1)
                      .slice(
                        offset * upcomingIndex,
                        offset * upcomingIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ Type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </DisplayStand>
            </Slider>
            <Slider>
              <StandTitles>
                <StandTitle>최고 평점</StandTitle>
                <ShowMore onClick={increaseTopRatedIndex}>
                  <span>더보기</span>
                </ShowMore>
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
                    {topRated?.results
                      .slice(1)
                      .slice(
                        offset * topRatedIndex,
                        offset * topRatedIndex + offset
                      )
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          onClick={() => onBoxClicked(movie.id)}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))}
                  </Row>
                </AnimatePresence>
              </DisplayStand>
            </Slider>
            <StandTitle>가장 최신 영화</StandTitle>
            <LatestDiv>
              {latest?.backdrop_path === null ? (
                <NoCover>
                  <span>No Cover</span>
                </NoCover>
              ) : (
                <YesCover
                  bgPhoto={makeImagePath(latest?.backdrop_path || "")}
                />
              )}
              <LatestInfo>
                <LatestTitle>{latest?.title}</LatestTitle>
                {latest?.overview === null || latest?.overview == "" ? (
                  <LatestOverview>
                    이 작품의 줄거리가 아직 등록되지 않았습니다.
                  </LatestOverview>
                ) : (
                  <LatestOverview>{latest?.overview}</LatestOverview>
                )}
              </LatestInfo>
            </LatestDiv>
            {bigMovieMatch ? (
              <>
                <Overlay onClick={onOverlayClick} />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie() && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie().backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie().title}</BigTitle>
                      <BigInfo>
                        <BigOverview>{clickedMovie().overview}</BigOverview>
                        <BigOtherInfos>
                          <BigOtherInfo>
                            언어: {clickedMovie().original_language}
                          </BigOtherInfo>
                          <BigOtherInfo>
                            평점: {clickedMovie().vote_average}
                          </BigOtherInfo>
                        </BigOtherInfos>
                      </BigInfo>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
/*
<Upcoming />
          <TopRated />
          <LatestMovie />
          */

export default function Movies() {
  return <div>Movies!!</div>;
}
