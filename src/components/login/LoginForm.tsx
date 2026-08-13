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
      className="relative z-10 w-full max-w-[460px]"
    >
      <div className="login-card border-border bg-card border p-8">
        {/* Brand */}
        <div className="login-brand relative mb-7 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex min-w-0 flex-col">
              <div className="text-foreground text-[20px] leading-none font-semibold">
                {t("brand")}
              </div>

              <div className="text-muted-foreground mt-1.5 text-[16px]">
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
          className="space-y-5"
        >
          <div className="login-field">
            <FormField
              label={t("email")}
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              register={register("email")}
              error={errors.email}
              containerClassName="[&_input]:h-[50px] [&_input]:text-[15px] [&_label]:text-[15px]"
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
              containerClassName="[&_input]:h-[50px] [&_input]:text-[15px] [&_label]:text-[15px]"
            />
          </div>

          {/* Server Error */}
          <div
            ref={errorRef}
            className="h-0 overflow-hidden opacity-0"
          >
            {errors.root?.message && (
              <div
                role="alert"
                className="border-destructive/30 bg-destructive/5 border px-4 py-3"
              >
                <p className="text-destructive text-sm">
                  {errors.root.message}
                </p>
              </div>
            )}
          </div>

          <div className="login-submit mt-8">
            <CustomButton
              type="submit"
              intent="primary"
              variant="solid"
              size="lg"
              loading={isSubmitting}
              leftSection={
                <LogIn
                  size={19}
                  strokeWidth={1.8}
                />
              }
              className="h-[50px] w-full text-[15px]"
            >
              {t("submit")}
            </CustomButton>
          </div>
        </form>

        {/* Security Note */}
        <div className="login-footer border-border mt-7 border-t pt-5">
          <p className="text-muted-foreground text-center text-xs leading-5">
            {t("restricted")}
          </p>
        </div>
      </div>
    </div>
  );
}