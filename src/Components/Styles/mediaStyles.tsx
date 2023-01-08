import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: bold;
  margin-top: 50px;
`;

export const Banner = styled.div<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

export const Title = styled.h2`
  font-size: 68px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

export const Slider = styled.div`
  position: relative;
  top: -100px;
  margin-bottom: 300px;
`;

export const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  left: 0px;
  right: 0px;
  margin: 0 auto;
`;

export const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  height: 450px;
  border-radius: 20px;
  color: red;
  font-size: 60px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

export const StandTitles = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
`;

export const StandTitle = styled.h2`
  font-size: 39px;
  font-weight: bold;
  margin-left: 50px;
  margin-bottom: 20px;
  margin-right: 80px;
`;

export const AddIndexBtn = styled.div`
  position: absolute;
  right: 20px;
  top: 270px;
  z-index: 5;
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3c2a21;
  color: white;
  display: flex;
  align-items: Center;
  justify-content: center;
  opacity: 0;
  transition-duration: 0.5s;
  &:hover {
    opacity: 1;
  }
`;

export const SubtractIndexBtn = styled.div`
  position: absolute;
  left: 20px;
  top: 270px;
  z-index: 5;
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #3c2a21;
  color: white;
  display: flex;
  align-items: Center;
  justify-content: center;
  opacity: 0;
  transition-duration: 0.5s;
  &:hover {
    opacity: 1;
  }
`;

export const SlideBtn = styled.div`
  background-color: red;
  width: 40px;
  height: 200px;
  margin: 10px;
`;

export const Info = styled(motion.section)`
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  height: 25%;
  bottom: 0;
  border-radius: 0 0 20px 20px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

export const InfoBtns = styled.section`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const InfoLeftBtns = styled.section`
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

export const InfoBtn = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  font-weight: bold;
  color: white;
  background-color: #495579;
  margin-right: 10px;
`;

export const InfoSentences = styled.section`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
`;

export const InfoTitle = styled.p`
  width: 100%;
  font-size: 15px;
  font-weight: bold;
  color: white;
  height: 50%;
  display: flex;
  align-items: center;
  justify=content: start;
  padding-left: 10px;
`;

export const InfoGenres = styled.div`
  width: 100%;
  font-size: 8px;
  height: 50%;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: white;
  padding-left: 10px;
`;

export const InfoGenre = styled.span`
  margin-right: 10px;
`;

export const DisplayStand = styled.div``;

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

export const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 150vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 20px 10px black;
`;

export const BigCover = styled.div`
  width: 100%;
  flex: 4 0 0;
  background-size: cover;
  background-position: center center;
`;

export const BigAllInfos = styled.section`
  width: 100%;
  flex: 6 0 0;
  display: flex;
  flex-direction: column;
`;

export const BigSentenceInfos = styled.section`
  width: 100%;
  height: 40%;
  display: flex;
`;

export const BigMainInfos = styled.section`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  padding-top: 0px;
  justify-content: center;
  padding: 0 10px;
`;

export const BigOtherInfos = styled.section`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding-left: 20px;
`;

export const BigOtherInfo = styled.span`
  font-size: 15px;
  margin: 1px 0;
`;

export const SimilarMovies = styled.section`
  width: 100%;
  height: 60%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
`;

export const SimilarTitle = styled.h2`
  font-size: 30px;
  font-weight: bold;
  margin: 0 auto;
`;

export const SimilarMovie = styled.section<{ bgphoto: string }>`
  border: 1px black solid;
  border-radius: 10px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
`;

export const BigMediaTitle = styled.h1<{ titleLength: number }>`
  fontweight: "bold";
  font-size: ${(props) => (props.titleLength > 20 ? "25px" : "35px")};
  margin-bottom: 5px;
`;

export const Video = styled.iframe`
  width: 100vw;
  height: 70vh;
`;
