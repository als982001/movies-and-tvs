import { useQuery } from "react-query";
import styled from "styled-components";
import { getLatestMovie, getLatestTv, ILatestMovie, ILatestTv } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
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

const LatestMedia = styled.section`
  width: 80vw;
  height: 80vh;
  border-radius: 50px;
  background-color: #282a3a;
  margin-bottom: 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LatestNoPoster = styled.section`
  width: 65%;
  height: 90%;
  background-color: #1a120b;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  font-size: 100px;
  font-weight: bold;
`;

const LatestMediaPoster = styled.section<{ bgphoto: string }>`
  width: 65%;
  height: 90%;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  border-radius: 20px;
`;

const LatestMediaInfos = styled.section`
  width: 25%;
  height: 90%;
  background-color: #d8d8d8;
  border-radius: 20px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: #182747;
`;

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
