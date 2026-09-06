"use client";

import type { RefObject } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface UseProductRowAnimationProps {
  rowRef: RefObject<HTMLElement | null>;
  animationIndex: number;
}

export const useProductRowAnimation = ({
  rowRef,
  animationIndex,
}: UseProductRowAnimationProps) => {
  useGSAP(
    () => {
      if (!rowRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          delay: Math.min(animationIndex, 8) * 0.05,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );
};
