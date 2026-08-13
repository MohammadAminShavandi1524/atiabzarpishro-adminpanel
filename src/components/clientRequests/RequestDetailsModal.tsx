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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-details-title"
        onClick={(event) => event.stopPropagation()}
        className="border-border bg-card relative z-10 w-full max-w-[680px] border shadow-2xl"
      >
        {/* Header */}
        <div className="request-modal-item border-border flex items-start justify-between gap-6 border-b px-7 py-6">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2.5">
              <span className="bg-custom-primary size-2" />

              <span className="text-custom-primary text-xs font-semibold tracking-[0.08em]">
                {locale === "fa"
                  ? `${englishToPersianNumber(String(request.id))}#`
                  : `#${request.id}`}
              </span>
            </div>

            <h2
              id="request-details-title"
              className="text-foreground text-xl font-semibold"
            >
              {t("details.title")}
            </h2>

            <p className="text-muted-foreground mt-1.5 text-sm">
              {t("details.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            aria-label={t("details.close")}
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex size-10 shrink-0 cursor-pointer items-center justify-center border transition-colors duration-200"
          >
            <X size={19} strokeWidth={1.8} />
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
        <div className="request-modal-item px-7 py-6">
          <div className="mb-4 flex items-center gap-2.5">
            <MessageSquareText
              size={18}
              strokeWidth={1.8}
              className="text-custom-primary"
            />

            <h3 className="text-foreground text-sm font-semibold">
              {t("details.message")}
            </h3>
          </div>

          <div className="border-border bg-secondary-bg max-h-[220px] overflow-x-hidden overflow-y-auto border px-5 py-4">
            <p className="text-foreground text-sm leading-7 [overflow-wrap:anywhere] break-words whitespace-pre-wrap">
              {request.message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="request-modal-item border-border bg-card-secondary/40 flex items-center justify-between gap-5 border-t px-7 py-5">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <CalendarDays size={16} strokeWidth={1.8} />

            <span>{formatDate(request.created, locale)}</span>
          </div>

          <CustomButton
            type="button"
            variant="outline"
            intent="secondary"
            onClick={closeModal}
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
    <div className={`min-w-0 px-7 py-5 ${className ?? ""}`}>
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs font-medium">
        <Icon size={15} strokeWidth={1.8} />

        <span>{label}</span>
      </div>

      <p
        dir={dir}
        className="text-foreground text-sm font-medium [overflow-wrap:anywhere] break-words"
      >
        {value}
      </p>
    </div>
  );
}
