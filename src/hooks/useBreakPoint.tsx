import { useEffect, useState } from "react";

const breakpoints = {
  xs: "20rem", // 320px
  s: "30rem", // 480px
  sm: "40rem", // 640px
  md: "48rem", // 768px
  mlg: "56rem", // 896px
  lg: "64rem", // 1024px
  xl: "80rem", // 1280px
  _2xl: "96rem", // 1536px
  _3xl: "106rem", // 1696px
};

type BreakpointKeys = keyof typeof breakpoints;

export const useBreakpoints = () => {
  const [matches, setMatches] = useState<Record<BreakpointKeys, boolean>>(
    Object.keys(breakpoints).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<BreakpointKeys, boolean>,
    ),
  );

  useEffect(() => {
    const mediaQueries: Record<BreakpointKeys, MediaQueryList> = {} as any;

    const updateMatches = () => {
      const newMatches = {} as Record<BreakpointKeys, boolean>;
      (Object.keys(breakpoints) as BreakpointKeys[]).forEach((key) => {
        newMatches[key] = window.matchMedia(
          `(min-width: ${breakpoints[key]})`,
        ).matches;
      });
      setMatches(newMatches);
    };

    (Object.keys(breakpoints) as BreakpointKeys[]).forEach((key) => {
      mediaQueries[key] = window.matchMedia(`(min-width: ${breakpoints[key]})`);
      mediaQueries[key].addEventListener("change", updateMatches);
    });

    updateMatches();

    return () => {
      (Object.keys(breakpoints) as BreakpointKeys[]).forEach((key) => {
        mediaQueries[key].removeEventListener("change", updateMatches);
      });
    };
  }, []);

  return matches;
};
