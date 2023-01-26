import { useQuery } from "react-query";
import { AnimatePresence, useViewportScroll } from "framer-motion";
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

  const [onAirIndex, setOnAirIndex] = useState(0);
  const changeOnAirIndex = (plusIndex: boolean) => {
    if (onAir) {
      if (leaving) return;

      toggleLeaving();

      const totalTvs = onAir.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;

      if (plusIndex === true) {
        setOnAirIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setOnAirIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      }
    }
  };

  const [airingTodayIndex, setAiringTodayIndex] = useState(0);
  const changeAiringTodayIndex = (plusIndex: boolean) => {
    if (airingToday) {
      if (leaving) return;

      toggleLeaving();

      const totalTvs = airingToday.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;

      if (plusIndex === true) {
        setAiringTodayIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      } else {
        setAiringTodayIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
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
                <AddIndexBtn onClick={() => changeOnAirIndex(true)}>
                  ≫
                </AddIndexBtn>
                <SubtractIndexBtn onClick={() => changeOnAirIndex(false)}>
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
                    key={onAirIndex}
                  >
                    {onAir.results
                      .slice(1)
                      .slice(offset * onAirIndex, offset * onAirIndex + offset)
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + "onAir"}
                          key={tv.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(tv.backdrop_path)}
                          onClick={() => onBoxClicked("onAir", tv.id)}
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
                              <InfoTitle>{tv.name}</InfoTitle>
                              <InfoGenres>
                                {tv.genre_ids.slice(0, 3).map((genreId) => (
                                  <InfoGenre key={genreId}>{`● ${getTvGenre(
                                    genreId
                                  )}`}</InfoGenre>
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
                <StandTitle>Airing Today</StandTitle>
                <AddIndexBtn onClick={() => changeAiringTodayIndex(true)}>
                  ≫
                </AddIndexBtn>
                <SubtractIndexBtn onClick={() => changeAiringTodayIndex(false)}>
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
                    key={airingTodayIndex}
                  >
                    {airingToday.results
                      .slice(
                        offset * airingTodayIndex,
                        offset * airingTodayIndex + offset
                      )
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + "airingToday"}
                          key={tv.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(tv.backdrop_path)}
                          onClick={() => onBoxClicked("airingToday", tv.id)}
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
                              <InfoTitle>{tv.name}</InfoTitle>
                              <InfoGenres>
                                {tv.genre_ids.slice(0, 3).map((genreId) => (
                                  <InfoGenre key={genreId}>{`● ${getTvGenre(
                                    genreId
                                  )}`}</InfoGenre>
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
                      .map((tv) => (
                        <Box
                          layoutId={tv.id + "topRated"}
                          key={tv.id}
                          variants={boxVariants}
                          initial="normal"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          bgphoto={makeImagePath(tv.backdrop_path)}
                          onClick={() => onBoxClicked("topRated", tv.id)}
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
                              <InfoTitle>{tv.name}</InfoTitle>
                              <InfoGenres>
                                {tv.genre_ids.slice(0, 3).map((genreId) => (
                                  <InfoGenre key={genreId}>{`● ${getTvGenre(
                                    genreId
                                  )}`}</InfoGenre>
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
