"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { CustomSelectOption } from "./types";

interface CustomSelectItemProps {
  option: CustomSelectOption;
  selected: boolean;
  onSelect: (value: string) => void;
}

const CustomSelectItem = ({
  option,
  selected,
  onSelect,
}: CustomSelectItemProps) => {
  return (
    <motion.button
      type="button"
      whileTap={{
        scale: 0.995,
      }}
      onClick={() => onSelect(option.value)}
      className={cn(
        "group relative flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm",
        "transition-colors duration-200",
        selected
          ? "bg-custom-primary/5 text-foreground"
          : "text-muted-foreground hover:bg-foreground/[0.035] hover:text-foreground",
      )}
    >
      {/* Selected line */}
      <span
        aria-hidden="true"
        className={cn(
          "bg-custom-primary absolute inset-y-0 start-0 w-[2px] transition-transform duration-300",
          selected ? "scale-y-100" : "scale-y-0",
        )}
      />

      <span className="truncate">{option.label}</span>

      <Check
        strokeWidth={1.8}
        className={cn(
          "size-4 shrink-0 transition-all duration-200",
          selected
            ? "text-custom-primary scale-100 opacity-100"
            : "scale-75 opacity-0",
        )}
      />
    </motion.button>
  );
};

export default CustomSelectItem;
