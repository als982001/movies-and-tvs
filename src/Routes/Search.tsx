import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
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
import {
  infoVariants,
  Loader,
  Result,
  Results,
  resultVariants,
  SmallInfo,
  Wrapper,
} from "../Components/Styles/searchStyles";
import {
  Overlay,
  BigMovie,
  BigCover,
  BigAllInfos,
  BigSentenceInfos,
  BigMainInfos,
  BigOtherInfos,
  BigOtherInfo,
  BigMediaTitle,
  SimilarMovies,
  SimilarTitle,
  SimilarMovie,
} from "../Components/Styles/mediaStyles";
import { getMovieGenre, getTvGenre } from "../Components/genres";

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
  const [similar, setSimilar] = useState<IGetMovieResult | IGetTvResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

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
      {isLoading ? (
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
                style={{ top: 20 }}
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
