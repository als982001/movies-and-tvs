import { useQuery } from "react-query";
import styled from "styled-components";
import { getNowPlayingMovies, IGetMovieResult } from "../../api";
import { makeImagePath } from "../../utils";
import Movie from "./movie";

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
            <Movie page={"movies"} movieType={"nowPlaying"} />
            <Movie page={"movies"} movieType={"upcoming"} />
            <Movie page={"movies"} movieType={"topRated"} />
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
