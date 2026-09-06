"use client";

import type { RefObject } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface UseTechNewsPageAnimationProps {
  pageRef: RefObject<HTMLDivElement | null>;
}

export const useTechNewsPageAnimation = ({
  pageRef,
}: UseTechNewsPageAnimationProps) => {
  useGSAP(
    () => {
      if (!pageRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        return;
      }

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        ".tech-news-panel",
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
        },
      );

      timeline.fromTo(
        ".tech-news-toolbar",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.25",
      );

      timeline.fromTo(
        ".tech-news-header",
        {
          opacity: 0,
          y: 8,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.2",
      );
    },
    {
      scope: pageRef,
    },
  );
};
