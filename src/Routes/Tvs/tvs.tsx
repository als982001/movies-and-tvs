import { useQuery } from "react-query";
import { getOnAirTvs, IGetTvResult } from "../../api";
import { makeImagePath } from "../../utils";
import styled from "styled-components";
import Tv from "./tv";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  margin-top: 50px;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

export default function Tvs() {
  const { data: onAir, isLoading: onAirLoading } = useQuery<IGetTvResult>(
    ["tvs", "onAir"],
    getOnAirTvs
  );

  return (
    <Wrapper>
      {onAirLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(onAir.results[0].backdrop_path || "")}>
            <Title>{onAir.results[0].name}</Title>
            <Overview>{onAir.results[0].overview}</Overview>
          </Banner>
          <Tv page="tvs" tvType="onAir" />
          <Tv page="tvs" tvType="airingToday" />
          <Tv page="tvs" tvType="topRated" />
          <>
            {/* <Slider>
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
            ) : null} */}
          </>
        </>
      )}
    </Wrapper>
  );
}
