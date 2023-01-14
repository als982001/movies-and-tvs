import { useQuery } from "react-query";
import styled from "styled-components";
import { getLatestMovie, getLatestTv, ILatestMovie, ILatestTv } from "../api";
import {
  LatestMedia,
  LatestMediaInfos,
  LatestMediaPoster,
  LatestNoPoster,
  Loader,
  Wrapper,
} from "../Components/Styles/mediaStyles";
import { makeImagePath } from "../utils";

const Title = styled.p`
  font-size: 35px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 15px;
  text-align: center;
  margin-bottom: 10px;
`;

const Genres = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const OtherInfo = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Genre = styled.span``;

export default function Latest() {
  const { data: latestMovie, isLoading: latestMovieLoading } =
    useQuery<ILatestMovie>("latestMove", getLatestMovie);
  const { data: latestTv, isLoading: latestTvLoading } = useQuery<ILatestTv>(
    "latestTv",
    getLatestTv
  );

  return (
    <Wrapper
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {latestMovieLoading || latestTvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <LatestMedia style={{ marginTop: "100px" }}>
            {latestMovie.backdrop_path ? (
              <LatestMediaPoster
                bgphoto={makeImagePath(latestMovie.backdrop_path)}
              ></LatestMediaPoster>
            ) : (
              <LatestNoPoster>No Poster</LatestNoPoster>
            )}
            <LatestMediaInfos>
              <Title>{latestMovie.title}</Title>
              <Overview>
                {latestMovie.overview
                  ? latestMovie.overview.length > 100
                    ? latestMovie.overview.slice(0, 100) + "..."
                    : latestMovie.overview
                  : "No Overview"}
              </Overview>
              <Genres>
                {latestMovie.genres.length === 0 ? (
                  <p>No Genre Info</p>
                ) : (
                  latestMovie.genres.map((genre) => (
                    <Genre>{`✺ ${genre.name} `}</Genre>
                  ))
                )}
              </Genres>
              <OtherInfo>{`Status: ${latestMovie.status}`}</OtherInfo>
              <OtherInfo>{`Laugnage: ${latestMovie.original_language}`}</OtherInfo>
              <OtherInfo>{`Popularity: ${latestMovie.popularity}`}</OtherInfo>
              <OtherInfo>{`Vote Average: ${latestMovie.vote_average}`}</OtherInfo>
            </LatestMediaInfos>
          </LatestMedia>
          <LatestMedia>
            {latestTv.backdrop_path ? (
              <LatestMediaPoster
                bgphoto={makeImagePath(latestTv.backdrop_path)}
              ></LatestMediaPoster>
            ) : (
              <LatestNoPoster>No Poster</LatestNoPoster>
            )}
            <LatestMediaInfos>
              <Title>{latestTv.name}</Title>
              <Overview>
                {latestTv.overview
                  ? latestTv.overview.length > 100
                    ? latestTv.overview.slice(0, 100) + "..."
                    : latestTv.overview
                  : "No Overview"}
              </Overview>
              <Genres>
                {latestTv.genres.length === 0 ? (
                  <p>No Genre Info</p>
                ) : (
                  latestTv.genres.map((genre) => (
                    <Genre>{`✺ ${genre.name} `}</Genre>
                  ))
                )}
              </Genres>
              <OtherInfo>{`Status: ${latestTv.status}`}</OtherInfo>
              <OtherInfo>{`Laugnage: ${latestTv.original_language}`}</OtherInfo>
              <OtherInfo>{`Popularity: ${latestTv.popularity}`}</OtherInfo>
              <OtherInfo>{`Vote Average: ${latestTv.vote_average}`}</OtherInfo>
            </LatestMediaInfos>
          </LatestMedia>
        </>
      )}
    </Wrapper>
  );
}
