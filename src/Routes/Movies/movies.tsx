import { useQuery } from "react-query";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
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
  Display,
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
} from "../../Components/Variants/mediaVariants";
import { getMovieGenre } from "../../Components/genres";
import Movie from "./movie";

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

export default function Movies() {
  const { data: nowPlaying, isLoading: nowPlayingLoading } =
    useQuery<IGetMovieResult>(["movies", "nowPlaying"], getNowPlayingMovies);

  return (
    <Wrapper>
      {nowPlayingLoading ? (
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
            <Movie movieType={"nowPlaying"} />
            <Movie movieType={"upcoming"} />
            <Movie movieType={"topRated"} />
            <>
              {/*  <Slider>
                <StandTitles>
                  <StandTitle>Now Playing</StandTitle>
                </StandTitles>
                <div>
                  <AnimatePresence>
                    <Display>
                      {nowPlaying.results
                        .slice(1)
                        .slice(0, 18)
                        .map((movie) => (
                          <TBox
                            layoutId={movie.id + "nowPlaying"}
                            key={movie.id}
                            variants={boxVariants}
                            initial="normal"
                            whileHover="hover"
                            transition={{ type: "tween" }}
                            bgphoto={makeImagePath(movie.backdrop_path)}
                            onClick={() => onBoxClicked("nowPlaying", movie.id)}
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
                  <StandTitle>Upcoming</StandTitle>
                </StandTitles>
                <div>
                  <AnimatePresence>
                    <Display>
                      {upcoming.results.slice(0, 18).map((movie) => (
                        <TBox
                          layoutId={movie.id + "upcoming"}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path)}
                          onClick={() => onBoxClicked("upcoming", movie.id)}
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
                  <StandTitle>Top Rated</StandTitle>
                </StandTitles>
                <div>
                  <AnimatePresence>
                    <Display>
                      {topRated.results.slice(0, 18).map((movie) => (
                        <TBox
                          layoutId={movie.id + "topRated"}
                          key={movie.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(movie.backdrop_path)}
                          onClick={() => onBoxClicked("topRated", movie.id)}
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
                                          bgphoto={makeImagePath(
                                            s.backdrop_path
                                          )}
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
              ) : null} */}
            </>
          </>
        </>
      )}
    </Wrapper>
  );
}
