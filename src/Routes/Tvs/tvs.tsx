import { useQuery } from "react-query";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import {
  getOnAirTvs,
  getTopRatedTvs,
  ITv,
  IGetTvResult,
  getPopularTvs,
  API_KEY,
  getAiringTodayTvs,
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
  rowVariants,
} from "../../Components/Variants/mediaVariants";
import { tvGenres, getTvGenre } from "../../Components/genres";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

const offset = 6;

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

export default function Tvs() {
  const [clickedTv, setClickedTv] = useState<ITv>(emptyTv);
  const [clickedTvType, setClickedTvType] = useState<string>("");

  const { scrollY } = useViewportScroll();
  const history = useHistory();
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const [leaving, setLeaving] = useState(false);

  const { data: onAir, isLoading: onAirLoading } = useQuery<IGetTvResult>(
    ["tvs", "onAir"],
    getOnAirTvs
  );
  const { data: airingToday, isLoading: airingTodayLoading } =
    useQuery<IGetTvResult>(["tvs", "airingToday"], getAiringTodayTvs);
  const { data: topRated, isLoading: topRatedLoading } = useQuery<IGetTvResult>(
    ["tvs", "topRated"],
    getTopRatedTvs
  );

  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tvs/:tvId");

  const onOverlayClick = () => {
    setClickedTv((prev) => emptyTv);
    setClickedTvType((prev) => "");
    setSimilarLoading((prev) => true);
    history.push("/tvs");
  };
  const onBoxClicked = (type: string, tvId: number) => {
    let result = emptyTv;

    if (type === "onAir") {
      result = onAir.results.find((tv) => tv.id === tvId);
    } else if (type === "airingToday") {
      result = airingToday.results.find((tv) => tv.id === tvId);
    } else if (type === "topRated") {
      result = topRated.results.find((tv) => tv.id === tvId);
    }

    setClickedTv(result);
    setClickedTvType(type);

    history.push(`/tvs/${tvId}`);
  };

  const [similar, setSimilar] = useState<IGetTvResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (clickedTv) {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${clickedTv.id}/similar?api_key=${API_KEY}`
        );
        const json = await response.json();

        setSimilar(json);
        setSimilarLoading((prev) => false);
      }
    })();
  }, [clickedTv]);

  return (
    <Wrapper>
      {onAirLoading || airingTodayLoading || topRatedLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(onAir.results[0].backdrop_path || "")}>
            <Title>{onAir.results[0].name}</Title>
            <Overview>{onAir.results[0].overview}</Overview>
          </Banner>
          <>
            <Slider>
              <StandTitles>
                <StandTitle>On Air</StandTitle>
              </StandTitles>
              <div>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Display>
                    {onAir.results
                      .slice(1)
                      .slice(0, 18)
                      .map((tv) => (
                        <TBox
                          layoutId={tv.id + "onAir"}
                          key={tv.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(tv.backdrop_path)}
                          onClick={() => onBoxClicked("onAir", tv.id)}
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
            <Slider>
              <StandTitles>
                <StandTitle>Airing Today</StandTitle>
              </StandTitles>
              <div>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Display>
                    {airingToday.results.slice(0, 18).map((tv) => (
                      <TBox
                        layoutId={tv.id + "airingToday"}
                        key={tv.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        onClick={() => onBoxClicked("airingToday", tv.id)}
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
            <Slider>
              <StandTitles>
                <StandTitle>Top Rated</StandTitle>
              </StandTitles>
              <div>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                  <Display>
                    {topRated.results.slice(0, 18).map((tv) => (
                      <TBox
                        layoutId={tv.id + "topRated"}
                        key={tv.id}
                        variants={boxVariants}
                        initial="normal"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.backdrop_path)}
                        onClick={() => onBoxClicked("topRated", tv.id)}
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
            {bigTvMatch ? (
              <>
                <Overlay onClick={onOverlayClick} />
                <BigMovie
                  style={{ top: scrollY.get() + 20 }}
                  layoutId={bigTvMatch.params.tvId + clickedTvType}
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
                              {clickedTv.overview
                                ? clickedTv.overview.length > 500
                                  ? clickedTv.overview.slice(0, 500) + "..."
                                  : clickedTv.overview
                                : "There is no overview."}
                            </p>
                          </BigMainInfos>
                          <BigOtherInfos>
                            {clickedTv.genre_ids.map((genreId) => (
                              <BigOtherInfo key={genreId}>
                                {`● ${getTvGenre(genreId)}`}
                              </BigOtherInfo>
                            ))}
                            <BigOtherInfo>
                              {`First Air Date: ${clickedTv.first_air_date}`}
                            </BigOtherInfo>
                            <BigOtherInfo>
                              {`Popularity: ${clickedTv.popularity}`}
                            </BigOtherInfo>
                            <BigOtherInfo>
                              {`Vote Average: ${clickedTv.vote_average}`}
                            </BigOtherInfo>
                          </BigOtherInfos>
                        </BigSentenceInfos>
                        <SimilarTitle>Similar Tvs</SimilarTitle>
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
                                          s.backdrop_path,
                                          "w500"
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
            ) : null}
          </>
        </>
      )}
    </Wrapper>
  );
}
