const [airingTodayIndex, setAiringTodayIndex] = useState(0);
const changeAiringTodayIndex = (plusIndex: boolean) => {
  if (airingToday) {
    if (leaving) return;

    toggleLeaving();

    const totalTvs = airingToday.results.length - 1;
    const maxIndex = Math.floor(totalTvs / offset) - 1;

    if (plusIndex === true) {
      setAiringTodayIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else {
      setAiringTodayIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
};

const [topRatedIndex, setTopRatedIndex] = useState(0);
const changeTopRatedIndex = (plusIndex: boolean) => {
  if (topRated) {
    if (leaving) return;

    toggleLeaving();

    const totalMovies = topRated.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    if (plusIndex === true) {
      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else {
      setTopRatedIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
};

const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
const changeNowPlayingIndex = (plusIndex: boolean) => {
  if (nowPlaying) {
    if (leaving) return;

    addIndex = plusIndex;
    console.log(addIndex);

    toggleLeaving();

    const totalMovies = nowPlaying.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    if (plusIndex === true) {
      setNowPlayingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else {
      setNowPlayingIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
};

const [upcomingIndex, setUpcomingIndex] = useState(0);
const changeUpcomingIndex = (plusIndex: boolean) => {
  if (upcoming) {
    if (leaving) return;

    toggleLeaving();

    const totalMovies = upcoming.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    if (plusIndex === true) {
      setUpcomingIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else {
      setUpcomingIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
};

const [topRatedIndex, setTopRatedIndex] = useState(0);
const changeTopRatedIndex = (plusIndex: boolean) => {
  if (topRated) {
    if (leaving) return;

    toggleLeaving();

    const totalMovies = topRated.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;

    if (plusIndex === true) {
      setTopRatedIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    } else {
      setTopRatedIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  }
};

const offset = 6;

const rowVariants = {
  hidden: (addIndex: boolean) => ({
    // x: addIndex ? -window.outerWidth - 5 : window.outerWidth + 5,
    x: window.outerWidth + 5,
  }),

  /*   hidden: {
    x: window.outerWidth + 5,
    backgroundColor: addIndex ? "green" : "ivory",
  }, */
  visible: {
    x: 0,
  },
  /*   exit: {
    x: -window.outerWidth - 5,
    backgroundColor: addIndex ? "blue" : "yellow",
  }, */
  exit: (addIndex: boolean) => {
    return {
      // x: addIndex ? window.outerWidth + 5 : -window.outerWidth - 5,
      x: -window.outerWidth - 5,
    };
  },
};

const [leaving, setLeaving] = useState(false);
const toggleLeaving = () => setLeaving((prev) => !prev);
