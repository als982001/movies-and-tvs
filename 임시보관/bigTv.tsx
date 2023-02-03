import { useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { ITv, IGetTvResult, API_KEY } from "../src/api";

interface IBigTv {
  tvType: string;
  clickedTv: ITv;
}

export default function ClickedBigTv({ tvType, clickedTv }: IBigTv) {
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tvs/:tvId");
  const [similar, setSimilar] = useState<IGetTvResult>();
  const [similarLoading, setSimilarLoading] = useState(true);

  const onOverlayClick = () => {
    setSimilarLoading((prev) => true);
    history.push("/tvs");
  };

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${clickedTv.id}/similar?api_key=${API_KEY}`
      );
      const json = await response.json();
      setSimilar(json);
      setSimilarLoading((prev) => false);
    })();
  });

  return <div></div>;
}
