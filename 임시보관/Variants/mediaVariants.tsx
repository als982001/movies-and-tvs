export const rowVariants = {
  /* hidden: (isBack: boolean) => ({
    x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5,
  }), */

  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
  /* exit: (isBack: boolean) => {
    return {
      x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5,
    };
  }, */
};

export const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
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
