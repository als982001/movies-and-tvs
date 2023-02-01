import styled from "styled-components";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.darker};
  width: 100vw;
  height: 210vh;
  display: flex;
  flex-direction: column;
`;

const Poster = styled.section`
  width: 100vw;
  height: 70vh;
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Introduction = styled.section`
  width: 40%;
  height: 80%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: rgba(73, 85, 121, 0.2);
  border-radius: 20px;
`;

const IntroductionTitle = styled.h1`
  font-size: 55px;
  font-weight: bold;
  color: #a4a4a4;
  margin-bottom: 5px;
`;

const IntroductionOverview = styled.p`
  font-size: 30px;
  font-weight: 300;
  color: #a4a4a4;
`;

const PageBtn = styled.div`
  background-color: ${(props) => props.theme.black.lighter};
  width: 30%;
  height: 35%;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 20px;

  &:hover {
    background-color: ${(props) => props.theme.black.darker};
  }
`;

function Home() {
  return (
    <Wrapper>
      <Poster
        style={{
          alignItems: "end",
          marginTop: "50px",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://cdn.pixabay.com/photo/2020/12/28/20/45/frozen-lake-5868472_1280.jpg)`,
        }}
      >
        <Introduction style={{ marginRight: "50px" }}>
          <IntroductionTitle>영화, TV 정보를 한눈에!</IntroductionTitle>
          <IntroductionOverview style={{ height: "80vh" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            ut pretium metus. Suspendisse potenti. Phasellus eu hendrerit metus.
            Maecenas fermentum ante auctor ligula tincidunt sagittis. Morbi
            aliquet metus vel augue porttitor cursus sit amet vitae libero. Ut
            blandit pharetra augue id vestibulum.
          </IntroductionOverview>
        </Introduction>
      </Poster>
      <Poster
        style={{
          alignItems: "start",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://cdn.pixabay.com/photo/2022/12/30/10/47/typewriter-7686633_1280.jpg)`,
        }}
      >
        <Introduction style={{ marginLeft: "50px" }}>
          <IntroductionTitle>영화 확인하기</IntroductionTitle>
          <IntroductionOverview style={{ height: "100vh" }}>
            Ut suscipit, nisi non eleifend bibendum, purus erat pulvinar augue,
            convallis efficitur massa leo molestie purus. Curabitur nec mauris
            ullamcorper, vulputate turpis nec, tristique neque. Praesent
            euismod, erat quis tincidunt maximus, nisi elit aliquet risus, non
            ultricies nisl purus et ex. Aliquam non est risus.
          </IntroductionOverview>
          <PageBtn>
            <Link to="/movies">Movie</Link>
          </PageBtn>
        </Introduction>
      </Poster>
      <Poster
        style={{
          alignItems: "end",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),url(https://cdn.pixabay.com/photo/2022/12/28/21/10/night-7683839_1280.jpg)`,
        }}
      >
        <Introduction style={{ marginRight: "50px" }}>
          <IntroductionTitle>TV 확인하기</IntroductionTitle>
          <IntroductionOverview style={{ height: "100vh" }}>
            Morbi a mollis nibh. Pellentesque felis libero, sodales finibus
            augue sit amet, consequat lacinia ante. Duis in ligula vel purus
            facilisis viverra. Sed rutrum lacus a mauris molestie, eu pharetra
            est eleifend. Cras eget purus ac quam fringilla congue.
          </IntroductionOverview>
          <PageBtn>
            <Link to="/tvs">Tv</Link>
          </PageBtn>
        </Introduction>
      </Poster>
    </Wrapper>
  );
}

export default Home;
