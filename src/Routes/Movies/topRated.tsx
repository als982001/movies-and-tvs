import { click } from "@testing-library/user-event/dist/click";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getNowPlayingMovies,
  getTopRatedMovies,
  IGetMovieResult,
  IMovie,
} from "../../api";
import {
  Display,
  Loader,
  Slider,
  StandTitle,
  StandTitles,
} from "../../Components/Styles/mediaStyles";
import { makeImagePath } from "../../utils";
import ClickedBigMovie, { emptyMovie } from "./bigMovie";

export const boxVariants = {
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

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

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

export default function TopRated() {
  const history = useHistory();
  const { data, isLoading } = useQuery<IGetMovieResult>(
    "topRated",
    getTopRatedMovies
  );
  const [clickedMovie, setClickedMovie] = useState<IMovie>(emptyMovie);
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const onBoxClick = (movie: IMovie) => {
    setClickedMovie(movie);
    history.push(`/movies/${movie.id}`);
  };

  return (
    <>
      <Slider>
        <StandTitles>
          <StandTitle>Top Rated</StandTitle>
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
                    <TBox
                      layoutId={movie.id + "topRated"}
                      key={movie.id}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path)}
                      onClick={() => onBoxClick(movie)}
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
        )}
      </Slider>
      {bigMovieMatch ? (
        <ClickedBigMovie clickedMovie={clickedMovie} movieType={"topRated"} />
      ) : null}
    </>
  );
}
