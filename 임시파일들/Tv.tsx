import { useQuery } from "react-query";
import { useViewportScroll, AnimatePresence } from "framer-motion";
import {
  getOnAirTv,
  getPopularTv,
  getTopRatedTv,
  IGetTvResult,
  ILatestTv,
  getLatestTv,
} from "../src/api";
import { makeImagePath } from "../src/utils";
import { useState } from "react";
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
  StandTitle,
  StandTitles,
  DisplayStand,
  ShowMore,
  LatestDiv,
  YesCover,
  LatestInfo,
  LatestTitle,
  LatestOverview,
  NoCover,
} from "../Components/styleds";
import { useHistory, useRouteMatch } from "react-router-dom";
import {
  boxVariants,
  infoVariants,
  rowVariants,
} from "../src/Components/variants";

const offset = 6;

function Tv() {
  const history = useHistory();
  const onBoxClicked = (tvId: number) => history.push(`/tv/${tvId}`);
  const onOverlayClick = () => history.push("/tv");

  const { scrollY } = useViewportScroll();
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const { data, isLoading } = useQuery<IGetTvResult>(
    ["tvs", "onAir"],
    getOnAirTv
  );
  const { data: topRated, isLoading: topRatedLoading } = useQuery<IGetTvResult>(
    ["tvs", "topRated"],
    getTopRatedTv
  );
  const { data: popular, isLoading: popularLoading } = useQuery<IGetTvResult>(
    ["tvs", "popular"],
    getPopularTv
  );
  const { data: latest, isLoading: latestLoading } = useQuery<ILatestTv>(
    ["tvs", "latest"],
    getLatestTv
  );

  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const increaseTopRatedIndex = () => {
    if (topRated) {
      if (leaving) return;

      toggleLeaving();

      const totalTvs = topRated?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;

      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const [popularIndex, setPopularIndex] = useState(0);
  const increasePopularIndex = () => {
    if (popular) {
      if (leaving) return;

      toggleLeaving();

      const totalTvs = popular?.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;

      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const clickedTv = () => {
    if (bigTvMatch?.params.tvId) {
      let findResult = topRated?.results.find(
        (tv) => tv.id === +bigTvMatch.params.tvId
      );

      if (findResult === undefined) {
        popular?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);
      }

      return findResult;
    }
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading,,,</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <StandTitles>
              <StandTitle>최고 평점</StandTitle>`
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
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(tv.id)}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </DisplayStand>
          </Slider>
          <Slider>
            <StandTitles>
              <StandTitle>Popular</StandTitle>
              <ShowMore onClick={increasePopularIndex}>
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
                  key={popularIndex}
                >
                  {popular?.results
                    .slice(1)
                    .slice(
                      offset * popularIndex,
                      offset * popularIndex + offset
                    )
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(tv.id)}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </DisplayStand>
          </Slider>
          <StandTitle>가장 최신 Tv 프로그램</StandTitle>
          <LatestDiv>
            {latest?.backdrop_path === null ? (
              <NoCover>
                <span>No Cover</span>
              </NoCover>
            ) : (
              <YesCover bgPhoto={makeImagePath(latest?.backdrop_path || "")} />
            )}
            <LatestInfo>
              <LatestTitle>{latest?.name}</LatestTitle>
              {latest?.overview === null || latest?.overview == "" ? (
                <LatestOverview>
                  이 작품의 줄거리가 아직 등록되지 않았습니다.
                </LatestOverview>
              ) : (
                <LatestOverview>{latest?.overview}</LatestOverview>
              )}
            </LatestInfo>
          </LatestDiv>
          {bigTvMatch ? (
            <>
              <Overlay onClick={onOverlayClick}>
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv() && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv().backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedTv().name}</BigTitle>
                      <BigOverview>{clickedTv().overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </Overlay>
            </>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
