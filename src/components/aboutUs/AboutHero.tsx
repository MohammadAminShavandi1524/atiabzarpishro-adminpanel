"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function AboutHero() {
  const locale = useLocale();
  const t = useTranslations("About.hero");

  const isRTL = locale === "fa";

  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!introRef.current || !eyebrowLineRef.current || !metaRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) {
        gsap.set(
          [introRef.current.children, eyebrowLineRef.current, metaRef.current],
          {
            clearProps: "all",
          },
        );

        return;
      }

      const introChildren = Array.from(introRef.current.children);

      gsap.set(eyebrowLineRef.current, {
        scaleX: 0,
        transformOrigin: isRTL ? "right center" : "left center",
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(eyebrowLineRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: "power4.out",
        })
        .fromTo(
          introChildren,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.11,
          },
          "-=0.5",
        )
        .fromTo(
          metaRef.current,
          {
            opacity: 0,
            x: isRTL ? -40 : 40,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.95,
            ease: "power4.out",
          },
          "-=0.65",
        );
    },
    {
      scope: sectionRef,
      dependencies: [isRTL],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-secondary-bg border-border border-b"
    >
      <div className="w90 py-20">
        <div className="grid grid-cols-[1.35fr_0.65fr] items-end gap-20">
          <div ref={introRef} className="max-w-5xl">
            <div className="mb-6 flex items-center gap-4">
              <span
                ref={eyebrowLineRef}
                className="bg-custom-primary h-px w-12 shrink-0"
              />

              <span className="text-custom-primary text-base font-medium tracking-[0.14em]">
                {t("eyebrow")}
              </span>
            </div>

            <h1 className="text-foreground max-w-4xl text-6xl leading-[1.12] font-semibold">
              {t("title")}
            </h1>

            <p className="text-muted-foreground mt-7 max-w-4xl text-justify text-lg leading-9">
              {t("description")}
            </p>

            <a
              href="/catalogues/ati-abzar-pishro-catalogue.pdf"
              download
              className="group/catalogue border-border hover:border-custom-primary hover:text-custom-primary mt-9 inline-flex items-center gap-4 border px-6 py-4 text-lg font-medium transition-colors duration-300"
            >
              <span>{t("downloadCatalogue")}</span>

              <Download
                size={20}
                className="transition-transform duration-300"
              />
            </a>
          </div>

          <div ref={metaRef} className="border-border border-s ps-10">
            <span className="text-muted-foreground text-base tracking-[0.14em]">
              {t("established")}
            </span>

            <div className="text-custom-primary mt-3 text-7xl leading-none font-semibold">
              2012
            </div>

            <div className="border-border mt-9 border-t pt-6">
              <span className="text-foreground text-xl font-semibold">
                {t("companyName")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
