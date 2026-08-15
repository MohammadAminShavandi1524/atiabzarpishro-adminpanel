"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { CustomButton } from "../ui/custom-button";

export type NewsTab = "category" | "rootNews" | "parentNews" | "news";

interface SubmitButtonProps {
  current: NewsTab;
  disabled?: boolean;
  className?: string;
}

const SubmitButton = ({
  current,
  disabled = false,
  className,
}: SubmitButtonProps) => {
  const t = useTranslations("addNews.submitButton");

  return (
    <CustomButton
      type="submit"
      intent="primary"
      variant="solid"
      disabled={disabled}
      className={cn(
        "h-12 min-w-[150px] px-6 font-semibold",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {t(current)}
    </CustomButton>
  );
};

export default SubmitButton;
