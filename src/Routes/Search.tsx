import { useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  SearchKeyword,
  ISearchResult,
  ISearch,
  IGetMovieResult,
  IGetTvResult,
  API_KEY,
} from "../api";
import { makeImagePath } from "../utils";
import { getMovieGenre, getTvGenre } from "../Components/genres";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 5;
`;

const BigMovie = styled(motion.div)`
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

const SimilarMovies = styled.section`
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

const SimilarMovie = styled.section<{ bgphoto: string }>`
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

const Loader = styled.div`
  font-size: 40px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  padding-top: 100px;
  padding-bottom: 200px;
`;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 80vw;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;

const Result = styled(motion.section)`
  display: flex;
  height: 70vh;
  background-size: cover;
  background-position: center center;
  border-radius: 30px;
  position: relative;
`;

const SmallInfo = styled(motion.section)`
  width: 100%;
  height: 20%;
  position: absolute;
  bottom: 0;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 0 0 30px 30px;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 0 10px;
`;

const resultVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    opacity: 1,
    scale: 1.3,
    y: 0,
    zIndex: 5,
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

const emptyMedia: ISearch = {
  backdrop_path: "",
  genre_ids: [0],
  id: 0,
  media_type: "",
  original_language: "",
  overview: "",
  popularity: 0,
  poster_path: "",
  release_date: "",
  first_air_date: "",
  title: "",
  name: "",
  vote_average: 0,
  vote_count: 0,
};

function Search() {
  const [clickedMedia, setClickedMedia] = useState<ISearch>(emptyMedia);
  const [changeLoading, setChangeLoading] = useState(false);
  const [similar, setSimilar] = useState<IGetMovieResult | IGetTvResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  const { scrollY } = useViewportScroll();

  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<ISearchResult>("search", () =>
    SearchKeyword(keyword)
  );

  const onResultClick = (media: ISearch) => {
    setClickedMedia((prev) => media);
  };
  const onOverlayClick = () => {
    setClickedMedia((prev) => emptyMedia);
  };

  useEffect(() => {
    console.log(`ketword = ${keyword}`);
    setChangeLoading((prev) => true);
  }, [keyword]);

  useEffect(() => {
    setChangeLoading((prev) => false);
  }, [data]);

  useEffect(() => {
    (async () => {
      const response =
        clickedMedia.media_type === "tv"
          ? await fetch(
              `https://api.themoviedb.org/3/tv/${clickedMedia.id}/similar?api_key=${API_KEY}`
            )
          : await fetch(
              `https://api.themoviedb.org/3/movie/${clickedMedia.id}/similar?api_key=${API_KEY}`
            );
      const json = await response.json();

      setSimilar(json);
      setSimilarLoading((prev) => false);
    })();
  }, [clickedMedia]);

  return (
    <Wrapper>
      {isLoading || changeLoading ? (
        <Loader>Loading...</Loader>
      ) : data?.results.length === 0 ? (
        <Loader>Not Found</Loader>
      ) : (
        <>
          <Results>
            {data.results.map(
              (result) =>
                (result.media_type === "tv" ||
                  result.media_type === "movie") && (
                  <Result
                    key={result.id}
                    style={{
                      backgroundImage: `url(${makeImagePath(
                        result.backdrop_path
                      )})`,
                    }}
                    variants={resultVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    onClick={() => onResultClick(result)}
                    layoutId={`${result.id}_${result.media_type}`}
                  >
                    <SmallInfo variants={infoVariants}>
                      {result.media_type === "tv" ? result.name : result.title}
                    </SmallInfo>
                  </Result>
                )
            )}
          </Results>
          {clickedMedia.id !== 0 ? (
            <>
              <Overlay onClick={onOverlayClick} />
              <BigMovie
                style={{ top: scrollY.get() + 20 }}
                layoutId={`${clickedMedia.id}_${clickedMedia.media_type}`}
              >
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMedia.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigAllInfos>
                    <BigSentenceInfos>
                      <BigMainInfos>
                        <BigMediaTitle
                          titleLength={
                            clickedMedia.media_type === "tv"
                              ? clickedMedia.name.length
                              : clickedMedia.title.length
                          }
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {clickedMedia.media_type === "tv"
                            ? clickedMedia.name
                            : clickedMedia.title}
                        </BigMediaTitle>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: "300",
                          }}
                        >
                          {clickedMedia.overview.length > 350
                            ? clickedMedia.overview.slice(0, 350) + "..."
                            : clickedMedia.overview}
                        </p>
                      </BigMainInfos>
                      <BigOtherInfos>
                        {clickedMedia.media_type === "tv"
                          ? clickedMedia.genre_ids.map((genreId) => (
                              <BigOtherInfo key={genreId}>
                                {`● ${getTvGenre(genreId)}`}
                              </BigOtherInfo>
                            ))
                          : clickedMedia.genre_ids.map((genreId) => (
                              <BigOtherInfo key={genreId}>
                                {" "}
                                {`● ${getMovieGenre(genreId)}`}
                              </BigOtherInfo>
                            ))}
                        <BigOtherInfo>
                          {`Release Date: ${
                            clickedMedia.media_type === "tv"
                              ? clickedMedia.first_air_date
                              : clickedMedia.release_date
                          }`}
                        </BigOtherInfo>
                        <BigOtherInfo>
                          {`Popularity: ${clickedMedia.popularity}`}
                        </BigOtherInfo>
                        <BigOtherInfo>
                          {`Vote Average: ${clickedMedia.vote_average}`}
                        </BigOtherInfo>
                      </BigOtherInfos>
                    </BigSentenceInfos>
                    <SimilarTitle>Similar Medias</SimilarTitle>
                    <SimilarMovies>
                      {similarLoading ? (
                        <p>아직은 보여줄 수 없다.</p>
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
              </BigMovie>
            </>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}

export default Search;
