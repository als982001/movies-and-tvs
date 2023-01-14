import { useQuery } from "react-query";
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
        backgroundColor: "green",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {latestMovieLoading || latestTvLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <p>{latestMovie.backdrop_path}</p>
          <LatestMedia style={{ marginTop: "100px" }}>
            {latestMovie.backdrop_path ? (
              <LatestMediaPoster
                bgphoto={makeImagePath(latestMovie.backdrop_path)}
              ></LatestMediaPoster>
            ) : (
              <LatestNoPoster>No Poster</LatestNoPoster>
            )}
            <LatestMediaInfos>
              <p style={{ fontSize: "35px", fontWeight: "bold" }}>
                {latestMovie.title}
              </p>
              <p>
                {latestMovie.overview
                  ? latestMovie.overview.length > 100
                    ? latestMovie.overview.slice(0, 100) + "..."
                    : latestMovie.overview
                  : "No Overview"}
              </p>
              {latestMovie.genres.length === 0 ? (
                <p>No Genre Info</p>
              ) : (
                latestMovie.genres.map((genre) => <p>{genre.name}</p>)
              )}
              <p>{latestMovie.status}</p>
              <p>{latestMovie.original_language}</p>
              <p>{latestMovie.popularity}</p>
              <p>{latestMovie.vote_average}</p>
            </LatestMediaInfos>
          </LatestMedia>
          <LatestMedia></LatestMedia>
        </>
      )}
    </Wrapper>
  );
}
