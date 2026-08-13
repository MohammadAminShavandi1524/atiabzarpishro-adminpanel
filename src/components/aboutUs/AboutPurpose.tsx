"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutPurpose() {
  const locale = useLocale();
  const t = useTranslations("About.purpose");

  const isRTL = locale === "fa";

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !headingRef.current ||
        !eyebrowLineRef.current ||
        !panelsRef.current
      ) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(
          [
            headingRef.current.children,
            eyebrowLineRef.current,
            panelsRef.current.children,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      const headingChildren = Array.from(headingRef.current.children);

      const panels = Array.from(panelsRef.current.children) as HTMLElement[];

      gsap.set(eyebrowLineRef.current, {
        scaleX: 0,
        transformOrigin: isRTL ? "right center" : "left center",
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });

      timeline
        .to(eyebrowLineRef.current, {
          scaleX: 1,
          duration: 0.75,
          ease: "power4.out",
        })
        .fromTo(
          headingChildren,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.11,
            ease: "power3.out",
          },
          "-=0.48",
        )
        .fromTo(
          panels,
          {
            opacity: 0,
            x: isRTL ? 38 : -38,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power4.out",
          },
          "-=0.42",
        );

      panels.forEach((panel, index) => {
        const content = panel.querySelectorAll(".purpose-content");

        gsap.fromTo(
          content,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            delay: 0.35 + index * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 84%",
              once: true,
            },
          },
        );
      });
    },
    {
      scope: sectionRef,
      dependencies: [isRTL],
      revertOnUpdate: true,
    },
  );

  return (
    <section ref={sectionRef} dir={isRTL ? "rtl" : "ltr"} className="w90 py-24">
      {/* Heading */}
      <div ref={headingRef} className="mb-14 max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <span
            ref={eyebrowLineRef}
            className="bg-custom-primary h-px w-12 shrink-0"
          />

          <span className="text-custom-primary text-base font-medium tracking-[0.14em]">
            {t("eyebrow")}
          </span>
        </div>

        <h2 className="text-foreground max-w-4xl text-[2.9rem] leading-[1.18] font-semibold">
          {t("title")}
        </h2>
      </div>

      {/* Purpose Panels */}
      <div
        ref={panelsRef}
        className="border-border grid grid-cols-2 border-s border-t"
      >
        {/* Vision */}
        <article className="group/purpose border-border hover:bg-card-secondary/50 relative border-e border-b p-10 transition-colors duration-700">
          <span
            className={[
              "bg-custom-primary pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-full",
              "scale-x-0 transition-transform duration-700",
              "ease-[cubic-bezier(0.65,0,0.35,1)]",
              "group-hover/purpose:scale-x-100",
              isRTL ? "origin-right" : "origin-left",
            ].join(" ")}
          />

          <span className="purpose-content text-muted-foreground group-hover/purpose:text-custom-primary text-base font-medium transition-colors duration-500">
            01
          </span>

          <h3 className="purpose-content text-foreground group-hover/purpose:text-custom-primary mt-6 text-3xl font-semibold transition-colors duration-500">
            {t("vision.title")}
          </h3>

          <p className="purpose-content text-muted-foreground mt-6 max-w-2xl text-lg leading-9">
            {t("vision.description")}
          </p>
        </article>

        {/* Mission */}
        <article className="group/purpose border-border hover:bg-card-secondary/50 relative border-e border-b p-10 transition-colors duration-700">
          <span
            className={[
              "bg-custom-primary pointer-events-none absolute inset-x-0 top-0 h-0.5 rounded-full",
              "scale-x-0 transition-transform duration-700",
              "ease-[cubic-bezier(0.65,0,0.35,1)]",
              "group-hover/purpose:scale-x-100",
              isRTL ? "origin-right" : "origin-left",
            ].join(" ")}
          />

          <span className="purpose-content text-muted-foreground group-hover/purpose:text-custom-primary text-base font-medium transition-colors duration-500">
            02
          </span>

          <h3 className="purpose-content text-foreground group-hover/purpose:text-custom-primary mt-6 text-3xl font-semibold transition-colors duration-500">
            {t("mission.title")}
          </h3>

          <p className="purpose-content text-muted-foreground mt-6 max-w-2xl text-lg leading-9">
            {t("mission.description")}
          </p>
        </article>
      </div>
    </section>
  );
}
