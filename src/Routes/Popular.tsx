import styled from "styled-components";
import Movie from "./Movies/movie";
import Tv from "./Tvs/tv";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

export default function Popular() {
  return (
    <Wrapper>
      <>
        <div style={{ width: "100%", height: "500px" }}></div>
        <>
          <Movie page="popular" movieType="popular" />
          <Tv page="popular" tvType="popular" />
        </>
      </>
    </Wrapper>
  );
}
