"use client";

import { useRef } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutCEO() {
  const locale = useLocale();
  const t = useTranslations("About.ceo");

  const isRTL = locale === "fa";
  const email = "Reza.adinelou@atiabzarpishro.com";

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);

  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const portraitMetaRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const professionalMetaRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        !sectionRef.current ||
        !headingRef.current ||
        !eyebrowLineRef.current ||
        !portraitWrapperRef.current ||
        !portraitMetaRef.current ||
        !contentRef.current ||
        !identityRef.current ||
        !backgroundRef.current ||
        !professionalMetaRef.current ||
        !emailRef.current
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
            portraitWrapperRef.current,
            portraitMetaRef.current,
            identityRef.current,
            backgroundRef.current,
            professionalMetaRef.current,
            emailRef.current,
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
          start: "top 76%",
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
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          portraitWrapperRef.current,
          {
            opacity: 0,
            x: isRTL ? 40 : -40,
            clipPath: isRTL ? "inset(0% 10% 0% 0%)" : "inset(0% 0% 0% 10%)",
          },
          {
            opacity: 1,
            x: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
            ease: "power4.out",
          },
          "-=0.35",
        )
        .fromTo(
          portraitMetaRef.current,
          {
            opacity: 0,
            y: 14,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.45",
        )
        .fromTo(
          identityRef.current,
          {
            opacity: 0,
            x: isRTL ? -32 : 32,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power4.out",
          },
          "-=0.7",
        )
        .fromTo(
          backgroundRef.current,
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.55",
        )
        .fromTo(
          professionalMetaRef.current.children,
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .fromTo(
          emailRef.current,
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
          "-=0.4",
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
      className="bg-secondary-bg border-border border-t"
    >
      <div className="w90 py-20">
        {/* Heading */}
        <div ref={headingRef} className="mb-10 flex items-center gap-4">
          <span
            ref={eyebrowLineRef}
            className="bg-custom-primary h-px w-12 shrink-0"
          />

          <span className="text-custom-primary text-base font-medium tracking-[0.14em]">
            {t("eyebrow")}
          </span>
        </div>

        <div className="grid grid-cols-[0.68fr_1.32fr] items-start gap-16">
          {/* Portrait */}
          <div>
            <div
              ref={portraitWrapperRef}
              className="border-border w-full max-w-[410px] overflow-hidden border"
            >
              <Image
                src="/about/ceo/ceo.webp"
                alt={t("name")}
                width={538}
                height={670}
                sizes="(max-width: 1024px) 40vw, 410px"
                className="h-auto w-full"
              />
            </div>

            <div
              ref={portraitMetaRef}
              className="border-border flex max-w-[410px] items-center justify-between border-b py-4"
            >
              <span className="text-muted-foreground text-sm font-medium tracking-wider">
                ATI ABZAR PISHRO
              </span>

              <span className="text-custom-primary text-sm font-medium">
                CEO
              </span>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            {/* Identity */}
            <div ref={identityRef} className="border-border border-b pb-7">
              <span className="text-custom-primary text-base font-medium">
                {t("position")}
              </span>

              <h2 className="text-foreground mt-3 max-w-4xl text-[3.15rem] leading-[1.12] font-semibold">
                {t("name")}
              </h2>
            </div>

            {/* Background */}
            <div ref={backgroundRef} className="border-border border-b py-7">
              <h3 className="text-foreground text-2xl font-semibold">
                {t("backgroundTitle")}
              </h3>

              <p className="text-muted-foreground mt-5 max-w-4xl text-justify text-lg leading-9">
                {t("background")}
              </p>
            </div>

            {/* Professional Meta */}
            <div
              ref={professionalMetaRef}
              className="border-border grid grid-cols-2 border-b"
            >
              <div className="border-border border-e py-6 pe-8">
                <span className="text-muted-foreground block text-sm font-medium tracking-wider">
                  {t("educationLabel")}
                </span>

                <p className="text-foreground mt-2.5 text-lg font-medium">
                  {t("education")}
                </p>
              </div>

              <div className="py-6 ps-8">
                <span className="text-muted-foreground block text-sm font-medium tracking-wider">
                  {t("roleLabel")}
                </span>

                <p className="text-foreground mt-2.5 text-lg font-medium">
                  {t("role")}
                </p>
              </div>
            </div>

            {/* Email */}
            <div ref={emailRef} className="pt-7">
              <a
                href={`mailto:${email}`}
                className="group/email inline-flex items-center gap-4"
              >
                <span className="border-border group-hover/email:border-custom-primary group-hover/email:text-custom-primary flex size-11 shrink-0 items-center justify-center border transition-colors duration-300">
                  <Mail size={19} strokeWidth={1.8} />
                </span>

                <div>
                  <span className="text-muted-foreground block text-sm font-medium tracking-wider">
                    {t("emailLabel")}
                  </span>

                  <span
                    dir="ltr"
                    className="text-foreground group-hover/email:text-custom-primary mt-1 block text-lg font-medium transition-colors duration-300"
                  >
                    {email}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
