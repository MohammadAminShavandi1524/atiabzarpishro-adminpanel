"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { FieldError } from "react-hook-form";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../scroll-area";
import CustomSelectItem from "./CustomSelectItem";
import { CustomSelectProps } from "./types";

const CustomSelect = <T extends string>({
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  error,
  disabled = false,
  className,
}: CustomSelectProps<T> & { error?: FieldError }) => {
  const locale = useLocale();

  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((item) => item.value === value),
    [options, value],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative flex flex-col gap-2.5", className)}>
      {/* Label */}
      {(label?.trim() || error) && (
        <div className="flex items-center justify-between gap-4">
          {label?.trim() && (
            <label className="text-foreground text-sm font-medium">
              {label}
            </label>
          )}

          {error && <p className="text-destructive text-xs">{error.message}</p>}
        </div>
      )}

      {/* Select */}
      <div ref={ref} className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "bg-background relative flex h-12 w-full cursor-pointer items-center justify-between border px-4 outline-none",
            "transition-[border-color,background-color] duration-300",
            open && !error && "border-custom-primary",
            error
              ? "border-destructive"
              : "border-border-secondary hover:border-foreground/20",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {/* Active marker */}
          <span
            aria-hidden="true"
            className={cn(
              "bg-custom-primary absolute inset-y-0 start-0 w-[2px] transition-transform duration-300",
              open ? "scale-y-100" : "scale-y-0",
            )}
          />

          <span
            className={cn(
              "truncate text-sm",
              selectedOption ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <motion.span
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="ms-4 flex shrink-0 items-center justify-center"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-colors duration-300",
                open ? "text-custom-primary" : "text-muted-foreground",
              )}
              strokeWidth={1.7}
            />
          </motion.span>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -6,
                scaleY: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scaleY: 1,
              }}
              exit={{
                opacity: 0,
                y: -6,
                scaleY: 0.98,
              }}
              transition={{
                duration: 0.18,
                ease: "easeOut",
              }}
              style={{
                transformOrigin: "top",
              }}
              className="bg-secondary-bg border-border-secondary absolute z-50 mt-2 w-full overflow-hidden border shadow-xl"
            >
              {/* Top accent */}
              <span
                aria-hidden="true"
                className="bg-custom-primary absolute inset-x-0 top-0 h-px"
              />

              <ScrollArea
                dir={locale === "en" ? "ltr" : "rtl"}
                className={cn("h-auto", options.length > 5 && "h-64")}
              >
                <div className="flex flex-col py-2">
                  {options.map((option) => (
                    <CustomSelectItem
                      key={option.value}
                      option={option}
                      selected={option.value === value}
                      onSelect={(selectedValue) => {
                        onChange(selectedValue as T);
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomSelect;
