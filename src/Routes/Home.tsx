import { Link } from "react-router-dom";
import {
  Introduction,
  IntroductionOverview,
  IntroductionTitle,
  PageBtn,
  Poster,
  Wrapper,
} from "../Components/Styles/homeStyles";

function Home() {
  return (
    <Wrapper>
      <Poster
        style={{
          alignItems: "end",
          marginTop: "50px",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://pbs.twimg.com/media/Fjh8aw-VQAAmTGK?format=jpg&name=4096x4096)`,
        }}
      >
        <Introduction style={{ marginRight: "50px" }}>
          <IntroductionTitle>영화, TV 정보를 한눈에!</IntroductionTitle>
          <IntroductionOverview style={{ height: "80vh" }}>
            星をめざして　何処までだって行こ　ワクワクを追いかけて
            じっとして居られないのは　本能的なものだ
            ほら　知れば知るほどに　ときめきが止まらない
            わたしがいつの日にか　星になれたなら　いいのに
          </IntroductionOverview>
        </Introduction>
      </Poster>
      <Poster
        style={{
          alignItems: "start",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(https://pbs.twimg.com/media/Fey14s-UoAAzR-Y?format=jpg&name=4096x4096)`,
        }}
      >
        <Introduction style={{ marginLeft: "50px" }}>
          <IntroductionTitle>영화 확인하기</IntroductionTitle>
          <IntroductionOverview style={{ height: "100vh" }}>
            立ち止まった　ふいに交差点で 読み返すキミのメッセージ
            すれ違う光も　さっきからスローモーション
            見惚れる　切り取った絵画みたいなトキ
            こんなにも　暖かい気持ちあっただなんて 初めての私になっていく
            あの日から　少しずつ キミの心を明るくする
            小さな灯(あか)りになれたらいいな
          </IntroductionOverview>
          <PageBtn>
            <Link to="/movies">Movie</Link>
          </PageBtn>
        </Introduction>
      </Poster>
      <Poster
        style={{
          alignItems: "end",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),url(https://pbs.twimg.com/media/FagsAfMUYAEvm7Q?format=jpg&name=4096x4096)`,
        }}
      >
        <Introduction style={{ marginRight: "50px" }}>
          <IntroductionTitle>TV 확인하기</IntroductionTitle>
          <IntroductionOverview style={{ height: "100vh" }}>
            おしえて 僕は何処へ向かえばいい? ずっと探していた
            大切な何かを（ほら!） いつか失くしてしまうものばかりなら
            強く刻んでおこう（今!） 惨めな夜もバカ笑いも
            あのね、その後が言えなかった日も （あいむあらいぶなういえ
            すぷりんぐたいむおぶらいふ） 嗚り止まなくてなにが悪い
            青春でなにが悪い
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
