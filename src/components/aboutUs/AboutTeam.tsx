"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { teamMembers } from "./about-team.data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutTeam() {
  const locale = useLocale();
  const t = useTranslations("About.team");

  const isRTL = locale === "fa";

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const cardsTrackRef = useRef<HTMLDivElement>(null);
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
    const lastIndex = teamMembers.length - 1;

    emblaApi.scrollTo(currentIndex === 0 ? lastIndex : currentIndex - 1);
  };

  const handleRight = () => {
    if (!emblaApi) return;

    const currentIndex = emblaApi.selectedScrollSnap();
    const lastIndex = teamMembers.length - 1;

    emblaApi.scrollTo(currentIndex === lastIndex ? 0 : currentIndex + 1);
  };

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !headingRef.current ||
        !eyebrowLineRef.current ||
        !carouselWrapperRef.current ||
        !cardsTrackRef.current ||
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
            cardsTrackRef.current.children,
            controlsRef.current,
          ],
          {
            clearProps: "all",
          },
        );

        return;
      }

      const headingChildren = Array.from(headingRef.current.children);

      const cards = Array.from(cardsTrackRef.current.children);

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
            y: 28,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .fromTo(
          cards,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.45",
        )
        .fromTo(
          controlsRef.current,
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.35",
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
              {String(teamMembers.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div ref={carouselWrapperRef} className="overflow-hidden">
          <div ref={emblaRef}>
            <div ref={cardsTrackRef} className="flex">
              {teamMembers.map((member) => (
                <div key={member.id} className="min-w-0 flex-[0_0_32%] pe-6">
                  <article className="group/member border-border bg-background relative min-h-[350px] border">
                    {/* Hover Line */}
                    <span
                      className={[
                        "bg-custom-primary pointer-events-none absolute inset-x-0 top-0 h-0.5",
                        "scale-x-0 transition-transform duration-700",
                        "ease-[cubic-bezier(0.65,0,0.35,1)]",
                        "group-hover/member:scale-x-100",
                        isRTL ? "origin-right" : "origin-left",
                      ].join(" ")}
                    />

                    <div className="flex min-h-[350px] flex-col p-8">
                      {/* Member Info */}
                      <div>
                        <h3 className="text-foreground group-hover/member:text-custom-primary text-2xl leading-tight font-semibold transition-colors duration-300">
                          {t(`members.${member.key}.name`)}
                        </h3>

                        <p className="text-custom-primary mt-3 text-base font-medium">
                          {t(`members.${member.key}.position`)}
                        </p>

                        {t.has(`members.${member.key}.areas`) && (
                          <div className="border-border mt-7 border-t pt-6">
                            <span className="text-muted-foreground text-sm font-medium tracking-wider">
                              {t("areasLabel")}
                            </span>

                            <p className="text-foreground mt-3 text-base leading-8">
                              {t(`members.${member.key}.areas`)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      {member.email && (
                        <div className="border-border mt-auto border-t pt-6">
                          <a
                            href={`mailto:${member.email}`}
                            className="group/email inline-flex max-w-full items-center gap-3"
                          >
                            <span className="border-border text-muted-foreground group-hover/email:border-custom-primary group-hover/email:text-custom-primary flex size-11 shrink-0 items-center justify-center border transition-colors duration-300">
                              <Mail size={19} strokeWidth={1.8} />
                            </span>

                            <span
                              dir="ltr"
                              className="text-muted-foreground group-hover/email:text-custom-primary truncate text-sm transition-colors duration-300"
                            >
                              {member.email}
                            </span>
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              ))}
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
              aria-label="Scroll team carousel left"
              className="border-border text-foreground hover:border-custom-primary hover:text-custom-primary flex size-12 cursor-pointer items-center justify-center border transition-colors duration-300"
            >
              <ArrowLeft
                className="size-5.25 transition-transform duration-300 rtl:rotate-180"
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={handleRight}
              aria-label="Scroll team carousel right"
              className="border-border text-foreground hover:border-custom-primary hover:text-custom-primary flex size-12 cursor-pointer items-center justify-center border transition-colors duration-300"
            >
              <ArrowRight
                className="size-5.25 transition-transform duration-300 rtl:rotate-180"
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
                  width: `${((selectedIndex + 1) / teamMembers.length) * 100}%`,
                }}
              />
            </div>

            <span className="text-muted-foreground text-sm">
              {String(teamMembers.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
