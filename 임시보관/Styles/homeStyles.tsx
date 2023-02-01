import styled from "styled-components";
import { motion } from "framer-motion";
import { NO_CONTROL, YOUTUBE_PATH } from "../../api";

export const Wrapper = styled.div`
  background-color: ${(props) => props.theme.black.darker};
  width: 100vw;
  height: 210vh;
  display: flex;
  flex-direction: column;
`;

export const Poster = styled.section`
  width: 100vw;
  height: 70vh;
  background-size: cover;
  background-position: center center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Introduction = styled.section`
  width: 40%;
  height: 80%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: rgba(73, 85, 121, 0.2);
  border-radius: 20px;
`;

export const IntroductionTitle = styled.h1`
  font-size: 55px;
  font-weight: bold;
  color: #a4a4a4;
  margin-bottom: 5px;
`;

export const IntroductionOverview = styled.p`
  font-size: 30px;
  font-weight: 300;
  color: #a4a4a4;
`;

export const PageBtn = styled.div`
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
