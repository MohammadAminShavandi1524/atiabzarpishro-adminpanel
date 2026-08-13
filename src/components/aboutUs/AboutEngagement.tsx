"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { engagementItems } from "./about-engagement.data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutEngagement() {
  const locale = useLocale();
  const t = useTranslations("About.engagement");

  const isRTL = locale === "fa";

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    direction: isRTL ? "rtl" : "ltr",
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleLeft = () => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    const lastIndex = engagementItems.length - 1;

    const targetIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;

    emblaApi.scrollTo(targetIndex);
  };

  const handleRight = () => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    const lastIndex = engagementItems.length - 1;

    const targetIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;

    emblaApi.scrollTo(targetIndex);
  };

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !headingRef.current ||
        !eyebrowLineRef.current ||
        !carouselWrapperRef.current ||
        !controlsRef.current
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
            carouselWrapperRef.current,
            controlsRef.current,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      const headingChildren = Array.from(headingRef.current.children);

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
          duration: 0.8,
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
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          carouselWrapperRef.current,
          {
            opacity: 0,
            y: 35,
            clipPath: "inset(8% 0% 0% 0%)",
          },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power4.out",
          },
          "-=0.4",
        )
        .fromTo(
          controlsRef.current,
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.45",
        );
    },
    {
      scope: sectionRef,
      dependencies: [isRTL],
      revertOnUpdate: true,
    },
  );

  useEffect(() => {
    if (!carouselWrapperRef.current) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const activeSlide = carouselWrapperRef.current.querySelector<HTMLElement>(
      `[data-engagement-index="${selectedIndex}"]`,
    );

    if (!activeSlide) return;

    const image = activeSlide.querySelector<HTMLElement>(".engagement-image");

    const caption = activeSlide.querySelector<HTMLElement>(
      ".engagement-caption",
    );

    const context = gsap.context(() => {
      if (image) {
        gsap.fromTo(
          image,
          {
            clipPath: isRTL ? "inset(0% 6% 0% 0%)" : "inset(0% 0% 0% 6%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: "power4.out",
            overwrite: "auto",
          },
        );
      }

      if (caption) {
        gsap.fromTo(
          caption,
          {
            opacity: 0,
            y: 14,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          },
        );
      }
    }, carouselWrapperRef);

    return () => context.revert();
  }, [selectedIndex, isRTL]);

  return (
    <section
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="border-border border-t py-24"
    >
      <div className="w90">
        {/* Heading */}
        <div className="mb-14 flex items-end justify-between gap-16">
          <div ref={headingRef} className="max-w-4xl">
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

          {/* Counter */}
          <div className="flex shrink-0 items-end gap-2">
            <span className="text-custom-primary text-3xl font-semibold">
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>

            <span className="text-muted-foreground mb-1 text-base">/</span>

            <span className="text-muted-foreground mb-1 text-base">
              {String(engagementItems.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div ref={carouselWrapperRef}>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {engagementItems.map((item, index) => {
                const isActive = selectedIndex === index;

                return (
                  <div
                    key={item.id}
                    data-engagement-index={index}
                    className="min-w-0 flex-[0_0_82%] pe-8"
                  >
                    <article>
                      {/* Image */}
                      <div
                        className={[
                          "engagement-image",
                          "border-border bg-card relative aspect-[1165/482] max-w-[900px] overflow-hidden border",
                          "transition-opacity duration-500",
                          isActive ? "opacity-100" : "opacity-55",
                        ].join(" ")}
                      >
                        <Image
                          src={item.image}
                          alt={t(`items.${item.key}.title`)}
                          fill
                          sizes="(max-width: 1280px) 75vw, 900px"
                          className="object-cover"
                        />
                      </div>

                      {/* Caption */}
                      <div className="engagement-caption max-w-[900px] pt-6">
                        <div className="border-border flex items-start justify-between gap-10 border-t pt-5">
                          <div>
                            <h3
                              className={[
                                "text-xl font-semibold transition-colors duration-300",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              ].join(" ")}
                            >
                              {t(`items.${item.key}.title`)}
                            </h3>

                            <p className="text-custom-primary mt-2 text-base font-medium">
                              {t(`items.${item.key}.date`)}
                            </p>
                          </div>

                          <span className="text-muted-foreground text-base">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          ref={controlsRef}
          className="mt-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLeft}
              aria-label="Scroll carousel left"
              className="border-border text-foreground hover:border-custom-primary hover:text-custom-primary flex size-12 cursor-pointer items-center justify-center border transition-colors duration-300"
            >
              <ArrowLeft
                className="size-5.25 transition-transform duration-300 rtl:rotate-180"
                size={21}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={handleRight}
              aria-label="Scroll carousel right"
              className="border-border text-foreground hover:border-custom-primary hover:text-custom-primary flex size-12 cursor-pointer items-center justify-center border transition-colors duration-300"
            >
              <ArrowRight
                className="size-5.25 transition-transform duration-300 rtl:rotate-180"
                size={21}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Progress */}
          <div className="flex w-64 items-center gap-4">
            <span className="text-muted-foreground text-sm">01</span>

            <div className="bg-border relative h-px flex-1 overflow-hidden">
              <span
                className="bg-custom-primary absolute inset-y-0 start-0 transition-[width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{
                  width: `${
                    ((selectedIndex + 1) / engagementItems.length) * 100
                  }%`,
                }}
              />
            </div>

            <span className="text-muted-foreground text-sm">
              {String(engagementItems.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
