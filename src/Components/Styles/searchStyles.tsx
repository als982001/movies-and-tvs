import styled from "styled-components";
import { motion } from "framer-motion";

export const Loader = styled.div`
  font-size: 40px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.div`
  padding-top: 100px;
  padding-bottom: 200px;
`;

export const Results = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 80vw;
\  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5px;
`;

export const Result = styled(motion.section)`
  display: flex;
  height: 70vh;
  background-size: cover;
  background-position: center center;
  border-radius: 30px;
  position: relative;
`;

export const SmallInfo = styled(motion.section)`
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

export const resultVariants = {
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

export const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};
