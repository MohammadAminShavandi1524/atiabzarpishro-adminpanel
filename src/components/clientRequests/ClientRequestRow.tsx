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
        <span className="bg-custom-primary absolute inset-y-0 start-0 w-[3px] scale-y-0 transition-transform duration-300 group-hover/request:scale-y-100" />

        <div className="3xl:min-h-[76px] 3xl:grid-cols-[60px_1.25fr_1.15fr_1.45fr_1.15fr_2fr_135px_110px] 3xl:gap-4 3xl:px-5 3xl:py-3 grid min-h-[76px] grid-cols-[60px_1.25fr_1.15fr_1.45fr_1.15fr_2fr_135px_110px] items-center gap-4 px-5 py-3 xl:min-h-[66px] xl:grid-cols-[46px_1.15fr_1fr_1.25fr_1fr_1.55fr_110px_86px] xl:gap-2.5 xl:px-3 xl:py-2.5 2xl:min-h-[71px] 2xl:grid-cols-[52px_1.2fr_1.05fr_1.35fr_1.05fr_1.75fr_120px_96px] 2xl:gap-3 2xl:px-4">
          <div
            dir={locale === "fa" ? "rtl" : "ltr"}
            className="text-muted-foreground 3xl:text-sm font-mono text-sm xl:text-[12px] 2xl:text-[13px]"
          >
            {locale === "fa"
              ? `${englishToPersianNumber(String(request.id))}#`
              : `#${request.id}`}
          </div>

          <div className="min-w-0">
            <p className="text-foreground 3xl:text-[15px] truncate text-[15px] font-medium xl:text-[13px] 2xl:text-[14px]">
              {request.full_name}
            </p>
          </div>

          <div className="text-muted-foreground 3xl:text-sm min-w-0 truncate text-sm xl:text-[12px] 2xl:text-[13px]">
            {request.phone_number}
          </div>

          <div className="min-w-0" onClick={(event) => event.stopPropagation()}>
            <a
              href={`mailto:${request.email}`}
              className="text-muted-foreground hover:text-custom-primary 3xl:text-sm block truncate text-sm transition-colors duration-300 xl:text-[12px] 2xl:text-[13px]"
            >
              {request.email}
            </a>
          </div>

          <div className="min-w-0">
            <p className="text-foreground 3xl:text-sm truncate text-sm xl:text-[12px] 2xl:text-[13px]">
              {request.company}
            </p>
          </div>

          <div className="3xl:pe-3 min-w-0 pe-3 xl:pe-1 2xl:pe-2">
            <p className="text-muted-foreground 3xl:text-sm 3xl:leading-6 line-clamp-2 text-sm leading-6 xl:text-[12px] xl:leading-5 2xl:text-[13px]">
              {request.message}
            </p>
          </div>

          <div className="text-muted-foreground 3xl:text-sm text-sm xl:text-[12px] 2xl:text-[13px]">
            {formattedDate}
          </div>

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
              leftSection={
                <Trash2
                  strokeWidth={1.8}
                  className="3xl:size-4 size-4 xl:size-3.5"
                />
              }
              className="3xl:h-9 3xl:px-3 3xl:text-sm h-9 px-3 text-sm xl:h-8 xl:px-2.5 xl:text-[12px] 2xl:text-[13px]"
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
