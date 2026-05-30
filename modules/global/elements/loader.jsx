import Router from "next/router";
import { useState, useEffect } from "react";

export const PageLoader = () => {
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      setPageLoading(true);
    });

    Router.events.on("routeChangeComplete", (url) => {
      setPageLoading(false);
    });

    Router.events.on("routeChangeError", (url) => {
      setPageLoading(false);
    });
  }, [Router]);

  return { pageLoading };
};

export default PageLoader;
