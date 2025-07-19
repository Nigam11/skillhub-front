// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScrollReset = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    handleScrollReset(); // Scroll on route change

    // Listen to popstate (browser back/forward)
    window.addEventListener("popstate", handleScrollReset);

    return () => {
      window.removeEventListener("popstate", handleScrollReset);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
