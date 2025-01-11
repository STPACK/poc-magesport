import { useState, useEffect } from "react";

const BREAKPOINT_MOBILE = 767;
const BREAKPOINT_DESKTOP = 1366;

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState(() => {
    const isClientSide = typeof window !== "undefined";
    return {
      width: isClientSide ? window.innerWidth : 0,
      height: isClientSide ? window.innerHeight : 0,
    };
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    ...windowSize,
    BREAKPOINT_MOBILE,
    BREAKPOINT_DESKTOP,
    isMobile: windowSize.width > 0 && windowSize.width <= BREAKPOINT_MOBILE,
    isTablet:
      windowSize.width > BREAKPOINT_MOBILE &&
      windowSize.width < BREAKPOINT_DESKTOP,
    isDesktop: windowSize.width >= BREAKPOINT_DESKTOP,
  };
}
