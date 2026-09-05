"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
} from "react";

import { createPortal } from "react-dom";

import { useLocale, useTranslations } from "next-intl";

import {
  Building2,
  CalendarDays,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomButton } from "@/components/ui/custom-button";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import type { ContactRequest } from "./client-requests.api";

gsap.registerPlugin(useGSAP);

interface RequestDetailsModalProps {
  open: boolean;
  onClose: () => void;
  request: ContactRequest;
}

export default function RequestDetailsModal({
  open,
  onClose,
  request,
}: RequestDetailsModalProps) {
  const t = useTranslations("ClientRequests");
  const locale = useLocale();

  const isRTL = locale === "fa";

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [renderModal, setRenderModal] = useState(open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setRenderModal(true);
    }
  }, [open]);

  const closeModal = useCallback(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !modalRef.current || !backdropRef.current) {
      setRenderModal(false);
      onClose();
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        setRenderModal(false);
        onClose();
      },
    });

    timeline.to(modalRef.current, {
      opacity: 0,
      y: 16,
      scale: 0.985,
      duration: 0.25,
      ease: "power2.in",
    });

    timeline.to(
      backdropRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      "<",
    );
  }, [onClose]);

  useEffect(() => {
    if (!renderModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [renderModal, closeModal]);

  useGSAP(
    () => {
      if (!renderModal || !modalRef.current || !backdropRef.current) {
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline.fromTo(
        backdropRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.3,
        },
      );

      timeline.fromTo(
        modalRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.985,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
        },
        "-=0.18",
      );

      timeline.fromTo(
        ".request-modal-item",
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.045,
        },
        "-=0.2",
      );
    },
    {
      scope: containerRef,
      dependencies: [renderModal],
    },
  );

  if (!mounted || !renderModal) return null;

  return createPortal(
    <div
      ref={containerRef}
      dir={isRTL ? "rtl" : "ltr"}
      className="3xl:p-6 fixed inset-0 z-[9999] flex items-center justify-center p-6 xl:p-4 2xl:p-5"
      onClick={closeModal}
    >
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        onClick={(event) => event.stopPropagation()}
        className="border-border bg-card 3xl:max-w-[680px] relative z-10 w-full max-w-[680px] border shadow-2xl xl:max-w-[600px] 2xl:max-w-[640px]"
      >
        {/* Header */}
        <div className="request-modal-item border-border 3xl:gap-6 3xl:px-7 3xl:py-6 flex items-start justify-between gap-6 border-b px-7 py-6 xl:gap-4 xl:px-5 xl:py-4.5 2xl:px-6 2xl:py-5">
          <div className="min-w-0">
            <div className="3xl:mb-2 3xl:gap-2.5 mb-2 flex items-center gap-2.5 xl:mb-1.5 xl:gap-2">
              <span className="bg-custom-primary 3xl:size-2 size-2 xl:size-1.5" />

              <span className="text-custom-primary 3xl:text-xs text-xs font-semibold tracking-[0.08em] xl:text-[11px]">
                {locale === "fa"
                  ? `${englishToPersianNumber(String(request.id))}#`
                  : `#${request.id}`}
              </span>
            </div>

            <h2
              id="request-details-title"
              className="text-foreground 3xl:text-xl text-xl font-semibold xl:text-[18px] 2xl:text-[19px]"
            >
              {t("details.title")}
            </h2>

            <p className="text-muted-foreground 3xl:mt-1.5 3xl:text-sm mt-1.5 text-sm xl:mt-1 xl:text-[13px]">
              {t("details.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label={t("details.close")}
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground 3xl:size-10 flex size-10 shrink-0 cursor-pointer items-center justify-center border transition-colors duration-200 xl:size-9"
          >
            <X
              strokeWidth={1.8}
              className="3xl:size-[19px] size-[19px] xl:size-[17px]"
            />
          </button>
        </div>

        {/* Info */}
        <div className="border-border grid grid-cols-2 border-b">
          <DetailItem
            icon={UserRound}
            label={t("table.fullName")}
            value={request.full_name}
            className="request-modal-item border-border border-e border-b"
          />

          <DetailItem
            icon={Building2}
            label={t("table.company")}
            value={request.company}
            className="request-modal-item border-border border-b"
          />

          <DetailItem
            icon={Phone}
            label={t("table.phoneNumber")}
            value={request.phone_number}
            dir="ltr"
            className="request-modal-item border-border border-e"
          />

          <DetailItem
            icon={Mail}
            label={t("table.email")}
            value={request.email}
            dir="ltr"
            className="request-modal-item"
          />
        </div>

        {/* Message */}
        <div className="request-modal-item 3xl:px-7 3xl:py-6 px-7 py-6 xl:px-5 xl:py-4.5 2xl:px-6 2xl:py-5">
          <div className="3xl:mb-4 3xl:gap-2.5 mb-4 flex items-center gap-2.5 xl:mb-3 xl:gap-2">
            <MessageSquareText
              strokeWidth={1.8}
              className="text-custom-primary 3xl:size-[18px] size-[18px] xl:size-4"
            />

            <h3 className="text-foreground 3xl:text-sm text-sm font-semibold xl:text-[13px]">
              {t("details.message")}
            </h3>
          </div>

          <div className="border-border bg-secondary-bg 3xl:max-h-[220px] 3xl:px-5 3xl:py-4 max-h-[220px] overflow-x-hidden overflow-y-auto border px-5 py-4 xl:max-h-[180px] xl:px-4 xl:py-3 2xl:max-h-[200px]">
            <p className="text-foreground 3xl:text-sm 3xl:leading-7 text-sm leading-7 [overflow-wrap:anywhere] break-words whitespace-pre-wrap xl:text-[13px] xl:leading-6">
              {request.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="request-modal-item border-border bg-card-secondary/40 3xl:gap-5 3xl:px-7 3xl:py-5 flex items-center justify-between gap-5 border-t px-7 py-5 xl:gap-3 xl:px-5 xl:py-4 2xl:px-6">
          <div className="text-muted-foreground 3xl:text-sm flex items-center gap-2 text-sm xl:text-[13px]">
            <CalendarDays
              strokeWidth={1.8}
              className="3xl:size-4 size-4 xl:size-3.5"
            />

            <span>{formatDate(request.created, locale)}</span>
          </div>

          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            onClick={closeModal}
            className="3xl:h-10 3xl:px-4 3xl:text-sm xl:h-9 xl:px-3 xl:text-[13px]"
          >
            {t("details.close")}
          </CustomButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}

interface DetailItemProps {
  icon: ElementType;
  label: string;
  value: string;
  className?: string;
  dir?: "ltr" | "rtl";
}

function DetailItem({
  icon: Icon,
  label,
  value,
  className,
  dir,
}: DetailItemProps) {
  return (
    <div
      className={`3xl:px-7 3xl:py-5 min-w-0 px-7 py-5 xl:px-5 xl:py-4 2xl:px-6 ${
        className ?? ""
      }`}
    >
      <div className="text-muted-foreground 3xl:mb-2 3xl:text-xs mb-2 flex items-center gap-2 text-xs font-medium xl:mb-1.5 xl:text-[11px]">
        <Icon
          strokeWidth={1.8}
          className="3xl:size-[15px] size-[15px] xl:size-3.5"
        />

        <span>{label}</span>
      </div>

      <p
        dir={dir}
        className="text-foreground 3xl:text-sm text-sm font-medium [overflow-wrap:anywhere] break-words xl:text-[13px]"
      >
        {value}
      </p>
    </div>
  );
}
