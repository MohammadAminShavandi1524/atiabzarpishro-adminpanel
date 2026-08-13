"use client";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { useLocale, useTranslations } from "next-intl";

import { Trash2 } from "lucide-react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { englishToPersianNumber, formatDate } from "@/lib/utils";

import { CustomHoldButton } from "@/components/ui/custom-button";

import type { ContactRequest } from "./client-requests.api";
import RequestDetailsModal from "./RequestDetailsModal";
import { deleteContactRequest } from "./delete-contact-request.api";
import { useCustomToast } from "../ui/custom-toast";

gsap.registerPlugin(useGSAP);

interface ClientRequestRowProps {
  request: ContactRequest;
  setRequests: Dispatch<SetStateAction<ContactRequest[]>>;
  animationIndex?: number;
}

export default function ClientRequestRow({
  request,
  setRequests,
  animationIndex = 0,
}: ClientRequestRowProps) {
  const locale = useLocale();
  const t = useTranslations("ClientRequests");
  const toast = useCustomToast();
  const rowRef = useRef<HTMLElement>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const formattedDate = formatDate(request.created, locale);

  const handleDelete = async () => {
    try {
      await deleteContactRequest(String(request.id));

      setRequests((prev) => prev.filter((item) => item.id !== request.id));

      toast.success(t("toast.delete.success"));
    } catch (error) {
      console.error("DELETE CONTACT REQUEST ERROR:", error);

      toast.error(t("toast.delete.error"));
    }
  };

  useGSAP(
    () => {
      if (!rowRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        rowRef.current,
        {
          opacity: 0,
          y: 14,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: Math.min(animationIndex, 8) * 0.055,
          ease: "power3.out",
        },
      );
    },
    {
      scope: rowRef,
    },
  );

  return (
    <>
      <article
        ref={rowRef}
        onClick={() => setDetailsOpen(true)}
        className="group/request border-border bg-background hover:border-border-secondary hover:bg-card-secondary/40 relative cursor-pointer border transition-[background-color,border-color] duration-300"
      >
        {/* Hover Indicator */}
        <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/request:scale-y-100" />

        <div className="grid min-h-[76px] grid-cols-[60px_1.25fr_1.15fr_1.45fr_1.15fr_2fr_135px_110px] items-center gap-4 px-5 py-3">
          {/* ID */}
          <div
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="text-muted-foreground font-mono text-sm"
          >
            {locale === "fa"
              ? `${englishToPersianNumber(String(request.id))}#`
              : `#${request.id}`}
          </div>

          {/* Full Name */}
          <div className="min-w-0">
            <p className="text-foreground truncate text-[15px] font-medium">
              {request.full_name}
            </p>
          </div>

          {/* Phone */}
          <div className="text-muted-foreground min-w-0 truncate text-sm">
            {request.phone_number}
          </div>

          {/* Email */}
          <div className="min-w-0" onClick={(event) => event.stopPropagation()}>
            <a
              href={`mailto:${request.email}`}
              className="text-muted-foreground hover:text-custom-primary block truncate text-sm transition-colors duration-300"
            >
              {request.email}
            </a>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm">
              {request.company}
            </p>
          </div>

          {/* Message */}
          <div className="min-w-0 pe-3">
            <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
              {request.message}
            </p>
          </div>

          {/* Date */}
          <div className="text-muted-foreground text-sm">{formattedDate}</div>

          {/* Actions */}
          <div
            className="flex justify-center"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
          >
            <CustomHoldButton
              type="button"
              intent="destructive"
              variant="soft"
              duration={800}
              onComplete={handleDelete}
              leftSection={<Trash2 size={16} strokeWidth={1.8} />}
              className="h-9 px-3 text-sm"
            >
              {t("actions.delete")}
            </CustomHoldButton>
          </div>
        </div>
      </article>

      <RequestDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        request={request}
      />
    </>
  );
}
