"use client";

import type { RefObject } from "react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface UseCatalogueFormAnimationProps {
  formRef: RefObject<HTMLFormElement | null>;
  locale: string;
}

export const useCatalogueFormAnimation = ({
  formRef,
  locale,
}: UseCatalogueFormAnimationProps) => {
  useGSAP(
    () => {
      if (!formRef.current) {
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
        formRef.current,
        {
          opacity: 0,
          y: 22,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
      );

      timeline.fromTo(
        ".catalogue-form-info",
        {
          opacity: 0,
          x: locale === "fa" ? 18 : -18,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
        },
        "-=0.35",
      );

      timeline.fromTo(
        ".catalogue-form-heading",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.25",
      );

      timeline.fromTo(
        ".catalogue-form-field",
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
        },
        "-=0.2",
      );

      timeline.fromTo(
        ".catalogue-form-submit",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
        },
        "-=0.15",
      );
    },
    {
      scope: formRef,
      dependencies: [locale],
    },
  );
};
