import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "react-query";
import {
  emptyTv,
  getAiringTodayTvs,
  getOnAirTvs,
  getTopRatedTvs,
  IGetTvResult,
  ITv,
} from "../../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  Display,
  Loader,
  Slider,
  StandTitle,
  StandTitles,
} from "../../Components/Styles/mediaStyles";
import { makeImagePath } from "../../utils";

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

interface ITvType {
  tvType: string;
}

export default function Tv({ tvType }: ITvType) {
  const history = useHistory();
  const { data, isLoading } = useQuery<IGetTvResult>(
    tvType,
    tvType === "onAir"
      ? getOnAirTvs
      : tvType === "airingToday"
      ? getAiringTodayTvs
      : getTopRatedTvs
  );

  const [clickedTv, setClickedTv] = useState<ITv>(emptyTv);
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tvs/:tvId");

  const onBoxClick = (tv: ITv) => {
    setClickedTv(tv);
    history.push(`tvs/${tv.id}`);
  };

  return (
    <>
      <Slider>
        <StandTitles>
          <StandTitle>
            {tvType === "onAir"
              ? "On Air"
              : tvType === "topRated"
              ? "Top Rated"
              : "Airing Today"}
          </StandTitle>
        </StandTitles>
        {isLoading ? (
          <Loader>Loading...</Loader>
        ) : (
          <div>
            <AnimatePresence>
              <Display>
                {data.results.slice(0, 18).map((tv) => (
                  <TBox
                    layoutId={tv.id + tvType}
                    key={tv.id}
                    variants={boxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(tv.backdrop_path)}
                    onClick={() => onBoxClick(tv)}
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
                        <span>{`🏳️: ${tv.original_language}`}</span>
                        <span>{`Score: ${tv.popularity}`}</span>
                      </TInfo>
                    </TInfos>
                  </TBox>
                ))}
              </Display>
            </AnimatePresence>
          </div>
        )}
      </Slider>
    </>
  );
}
