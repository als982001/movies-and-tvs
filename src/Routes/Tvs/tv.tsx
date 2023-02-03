import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useQuery } from "react-query";
import {
  API_KEY,
  getAiringTodayTvs,
  getOnAirTvs,
  getPopularTvs,
  getTopRatedTvs,
  IGetTvResult,
  ITv,
} from "../../api";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../../utils";
import { getTvGenre } from "../../Components/genres";

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

const BigTv = styled(motion.div)`
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

const SimilarTvs = styled.section`
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

const SimilarTv = styled.section<{ bgphoto: string }>`
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

interface ITvType {
  tvType: string;
  page: string;
}

const emptyTv: ITv = {
  poster_path: "",
  popularity: 0,
  id: 0,
  backdrop_path: "",
  vote_average: 0,
  overview: "",
  first_air_date: "",
  origin_country: [""],
  genre_ids: [0],
  original_language: "",
  vote_count: 0,
  name: "",
  original_name: "",
};

const typeTitle = (type: string): string => {
  if (type === "onAir") return "On Air";
  if (type === "airingToday") return "Airing Today";
  if (type === "popular") return "Popular Tvs";
  if (type === "topRated") return "Top Rated";

  return null;
};

const getTvs = (type: string) => {
  if (type === "onAir") return getOnAirTvs;
  if (type === "topRated") return getTopRatedTvs;
  if (type === "airingToday") return getAiringTodayTvs;
  if (type === "popular") return getPopularTvs;
};

export default function Tv({ tvType, page }: ITvType) {
  const history = useHistory();
  const { scrollY } = useScroll();
  const bigTvMatch = useRouteMatch<{ tvId: string }>(`/${page}/:tvId`);
  const [clickedTv, setClickedTv] = useState<ITv>(emptyTv);
  const [clicked, setClicked] = useState(false);
  const [similar, setSimilar] = useState<IGetTvResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  const { data, isLoading } = useQuery<IGetTvResult>(tvType, getTvs(tvType));

  /*
  const { data, isLoading } = useQuery<IGetTvResult>(
    tvType,
    tvType === "onAir"
      ? getOnAirTvs
      : tvType === "airingToday"
      ? getAiringTodayTvs
      : tvType === "popular"
      ? getPopularTvs
      : getTopRatedTvs
  );
  */

  const onBoxClick = (tv: ITv) => {
    setClickedTv(tv);
    setClicked((prev) => true);

    history.push(`/${page}/${tv.id}`);
  };

  const onOverlayClick = () => {
    setSimilarLoading((prev) => true);
    setClicked((prev) => false);

    history.push(`/${page}`);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${clickedTv.id}/similar?api_key=${API_KEY}`
      );
      const json = await response.json();
      setSimilar(json);
      setSimilarLoading((prev) => false);
    })();
  }, [clickedTv]);

  return (
    typeTitle(tvType) && (
      <>
        <Wrapper>
          <StandTitles>
            <StandTitle>{typeTitle(tvType)}</StandTitle>
          </StandTitles>
          {isLoading ? (
            <Loader>Loading...</Loader>
          ) : (
            <div>
              <AnimatePresence>
                <Display>
                  {data.results
                    .slice(1)
                    .slice(0, 18)
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + tvType}
                        key={tv.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        onClick={() => onBoxClick(tv)}
                      >
                        <Infos variants={infoVariants}>
                          <Info
                            style={{
                              width: "50%",
                              fontSize: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            {tv.name}
                          </Info>
                          <Info style={{ width: "30%" }}>
                            <span>{`🏳️: ${tv.original_language}`}</span>
                            <span>{`Score: ${tv.popularity}`}</span>
                          </Info>
                        </Infos>
                      </Box>
                    ))}
                </Display>
              </AnimatePresence>
            </div>
          )}
        </Wrapper>
        {bigTvMatch && clicked ? (
          <>
            <Overlay onClick={onOverlayClick} />
            <BigTv
              style={{ top: scrollY.get() + 20 }}
              layoutId={bigTvMatch.params.tvId + tvType}
            >
              {clickedTv ? (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedTv.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigAllInfos>
                    <BigSentenceInfos>
                      <BigMainInfos>
                        <BigMediaTitle
                          titleLength={clickedTv.name.length}
                          style={{ fontWeight: "bold" }}
                        >
                          {clickedTv.name}
                        </BigMediaTitle>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "300",
                          }}
                        >
                          {clickedTv.overview.length > 300
                            ? clickedTv.overview.slice(0, 300) + "..."
                            : clickedTv.overview}
                        </p>
                      </BigMainInfos>
                      <BigOtherInfos>
                        {clickedTv.genre_ids.map((genreId) => (
                          <BigOtherInfo key={genreId}>
                            {`● ${getTvGenre(genreId)}`}
                          </BigOtherInfo>
                        ))}
                        <BigOtherInfo>
                          {`Release Date: ${clickedTv.first_air_date}`}
                        </BigOtherInfo>
                        <BigOtherInfo>
                          {`Popularity: ${clickedTv.popularity}`}
                        </BigOtherInfo>
                        <BigOtherInfo>
                          {`Vote Average: ${clickedTv.vote_average}`}
                        </BigOtherInfo>
                      </BigOtherInfos>
                    </BigSentenceInfos>
                    <SimilarTitle>Similar Movies</SimilarTitle>
                    <SimilarTvs>
                      {similarLoading ? (
                        <p>아직은 보여줄 수 없다.</p>
                      ) : (
                        <>
                          {similar.results
                            ? similar.results
                                .slice(0, 6)
                                .map((s) => (
                                  <SimilarTv
                                    key={s.id}
                                    bgphoto={makeImagePath(s.backdrop_path)}
                                  />
                                ))
                            : null}
                        </>
                      )}
                    </SimilarTvs>
                  </BigAllInfos>
                </>
              ) : null}
            </BigTv>
          </>
        ) : null}
      </>
    )
  );
}
