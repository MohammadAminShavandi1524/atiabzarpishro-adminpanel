"use client";

import { useEffect, useMemo, useRef } from "react";

import { useLocale, useTranslations } from "next-intl";

import { LogIn } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton } from "@/components/ui/custom-button";

import { FormField } from "../FormField";

import { createLoginSchema, type LoginFormValues } from "./login.schema";
import { login } from "./auth.api";

gsap.registerPlugin(useGSAP);

export default function LoginForm() {
  const t = useTranslations("Login");
  const locale = useLocale();

  const isRTL = locale === "fa";

  const containerRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const schema = useMemo(
    () =>
      createLoginSchema({
        emailRequired: t("validation.emailRequired"),
        emailInvalid: t("validation.emailInvalid"),
        passwordRequired: t("validation.passwordRequired"),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      clearErrors("root");

      await login({
        email: data.email,
        password: data.password,
      });

      window.location.href = `/${locale}`;
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError("root", {
        type: "server",
        message: t("invalidCredentials"),
      });
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.fromTo(
        ".login-card",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
        },
      );

      tl.fromTo(
        ".login-brand",
        {
          opacity: 0,
          y: 12,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
        },
        "-=0.4",
      );

      tl.fromTo(
        ".login-brand-line",
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 0.65,
          transformOrigin: isRTL ? "right center" : "left center",
        },
        "-=0.3",
      );

      tl.fromTo(
        ".login-field",
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
        },
        "-=0.25",
      );

      tl.fromTo(
        ".login-submit",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.2",
      );

      tl.fromTo(
        ".login-footer",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
        },
        "-=0.2",
      );
    },
    {
      scope: containerRef,
      dependencies: [isRTL],
    },
  );

  useEffect(() => {
    if (!errorRef.current) return;

    if (errors.root?.message) {
      gsap.fromTo(
        errorRef.current,
        {
          height: 0,
          opacity: 0,
          y: -6,
          marginTop: 0,
        },
        {
          height: "auto",
          opacity: 1,
          y: 0,
          marginTop: 20,
          duration: 0.45,
          ease: "power3.out",
        },
      );
    } else {
      gsap.to(errorRef.current, {
        height: 0,
        opacity: 0,
        y: -6,
        marginTop: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }, [errors.root?.message]);

  return (
    <div
      ref={containerRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="3xl:max-w-[460px] relative z-10 w-full max-w-[460px] xl:max-w-[410px] 2xl:max-w-[435px]"
    >
      <div className="login-card border-border bg-card 3xl:p-8 border p-8 xl:p-6 2xl:p-7">
        {/* Brand */}
        <div className="login-brand 3xl:mb-7 3xl:pb-5 relative mb-7 pb-5 xl:mb-6 xl:pb-4 2xl:mb-6.5">
          <div className="flex items-center gap-2.5">
            <div className="flex min-w-0 flex-col">
              <div className="text-foreground 3xl:text-[20px] text-[20px] leading-none font-semibold xl:text-[18px] 2xl:text-[19px]">
                {t("brand")}
              </div>

              <div className="text-muted-foreground 3xl:mt-1.5 3xl:text-[16px] mt-1.5 text-[16px] xl:mt-1 xl:text-[14px] 2xl:text-[15px]">
                {t("panel")}
              </div>
            </div>
          </div>

          <div className="login-brand-line bg-border absolute inset-x-0 bottom-0 h-px" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="3xl:space-y-5 space-y-5 xl:space-y-4 2xl:space-y-4.5"
        >
          <div className="login-field">
            <FormField
              label={t("email")}
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              register={register("email")}
              error={errors.email}
            />
          </div>

          <div className="login-field">
            <FormField
              label={t("password")}
              type="password"
              autoComplete="current-password"
              placeholder={t("passwordPlaceholder")}
              register={register("password")}
              error={errors.password}
            />
          </div>

          {/* Server Error */}
          <div ref={errorRef} className="h-0 overflow-hidden opacity-0">
            {errors.root?.message && (
              <div
                role="alert"
                className="border-destructive/30 bg-destructive/5 3xl:px-4 3xl:py-3 border px-4 py-3 xl:px-3.5 xl:py-2.5"
              >
                <p className="text-destructive 3xl:text-sm text-sm xl:text-[13px]">
                  {errors.root.message}
                </p>
              </div>
            )}
          </div>

          <div className="login-submit 3xl:mt-8 mt-8 xl:mt-6 2xl:mt-7">
            <CustomButton
              type="submit"
              intent="primary"
              variant="solid"
              size="lg"
              loading={isSubmitting}
              leftSection={
                <LogIn
                  strokeWidth={1.8}
                  className="3xl:size-[19px] size-[19px] xl:size-[17px]"
                />
              }
              className="3xl:h-[50px] 3xl:text-[15px] h-[50px] w-full text-[15px] xl:h-[46px] xl:text-[14px] 2xl:h-[48px]"
            >
              {t("submit")}
            </CustomButton>
          </div>
        </form>

        {/* Security Note */}
        <div className="login-footer border-border 3xl:mt-7 3xl:pt-5 mt-7 border-t pt-5 xl:mt-6 xl:pt-4">
          <p className="text-muted-foreground 3xl:text-xs 3xl:leading-5 text-center text-xs leading-5 xl:text-[11px] xl:leading-[18px]">
            {t("restricted")}
          </p>
        </div>
      </div>
    </div>
  );
}
