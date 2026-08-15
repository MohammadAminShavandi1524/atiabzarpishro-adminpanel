"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../ui/scroll-area";

export interface TagOption {
  id: string;
  label: string;
}

interface TagSelectorProps {
  label: string;
  options: TagOption[];
  value: TagOption[];
  onChange: (tags: TagOption[]) => void;
  placeholder: string;
  className?: string;
  lang?: "fa" | "en";
}

export const TagSelector = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  className,
  lang = "fa",
}: TagSelectorProps) => {
  const locale = useLocale();
  const t = useTranslations("addNews");

  const [open, setOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<TagOption[]>(options);
  const [creating, setCreating] = useState(false);
  const [newTag, setNewTag] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailableTags(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setCreating(false);
        setNewTag("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isSelected = (tag: TagOption) => {
    return value.some((item) => item.id === tag.id);
  };

  const toggleTag = (tag: TagOption) => {
    if (isSelected(tag)) {
      onChange(value.filter((item) => item.id !== tag.id));

      return;
    }

    onChange([...value, tag]);
  };

  const removeTag = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const createTag = () => {
    const text = newTag.trim();

    if (!text) return;

    const exists = availableTags.find(
      (item) => item.label.toLowerCase() === text.toLowerCase(),
    );

    if (exists) {
      if (!isSelected(exists)) {
        onChange([...value, exists]);
      }

      setNewTag("");
      setCreating(false);

      return;
    }

    const created: TagOption = {
      id: crypto.randomUUID(),
      label: text,
    };

    setAvailableTags((prev) => [...prev, created]);

    onChange([...value, created]);

    setNewTag("");
    setCreating(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative flex flex-col gap-2.5", className)}
    >
      {/* Label */}
      {label?.trim() && (
        <label className="text-foreground text-sm font-medium">{label}</label>
      )}

      <div className="relative">
        {/* Trigger */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          className={cn(
            "bg-background border-border-secondary relative flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 border px-4 py-2 outline-none",
            "transition-[border-color,background-color] duration-300",
            "hover:border-foreground/20",
            open && "border-custom-primary",
          )}
        >
          {/* Active line */}
          <span
            aria-hidden="true"
            className={cn(
              "bg-custom-primary absolute inset-y-0 start-0 w-[2px] transition-transform duration-300",
              open ? "scale-y-100" : "scale-y-0",
            )}
          />

          {/* Selected Tags */}
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <AnimatePresence initial={false}>
              {value.length === 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-muted-foreground text-sm"
                >
                  {placeholder}
                </motion.span>
              )}

              {value.map((tag) => (
                <motion.div
                  key={tag.id}
                  layout
                  initial={{
                    opacity: 0,
                    scale: 0.94,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.94,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  lang={lang}
                  className="border-custom-primary/20 bg-custom-primary/[0.06] text-foreground flex items-center gap-2 border px-2.5 py-1 text-xs"
                >
                  <span className="max-w-[180px] truncate">{tag.label}</span>

                  <button
                    type="button"
                    aria-label={`Remove ${tag.label}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeTag(tag.id);
                    }}
                    className="text-muted-foreground hover:text-destructive flex cursor-pointer items-center justify-center transition-colors"
                  >
                    <X className="size-3.5" strokeWidth={1.8} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Arrow */}
          <motion.div
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="ms-3 flex shrink-0 items-center justify-center"
          >
            <ChevronDown
              className={cn(
                "size-4 transition-colors duration-300",
                open ? "text-custom-primary" : "text-muted-foreground",
              )}
              strokeWidth={1.7}
            />
          </motion.div>
        </div>

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
              className="bg-secondary-bg border-border-secondary absolute inset-x-0 top-[calc(100%+8px)] z-50 overflow-hidden border shadow-xl"
            >
              {/* Top Accent */}
              <span
                aria-hidden="true"
                className="bg-custom-primary absolute inset-x-0 top-0 h-px"
              />

              {/* Tags */}
              <ScrollArea
                dir={locale === "fa" ? "rtl" : "ltr"}
                className="h-52"
              >
                <div className="flex flex-col py-2">
                  {availableTags.map((tag) => {
                    const selected = isSelected(tag);

                    return (
                      <button
                        lang={lang}
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          "group relative flex w-full cursor-pointer items-center justify-between px-4 py-3 text-sm transition-colors duration-200",
                          selected
                            ? "bg-custom-primary/5 text-foreground"
                            : "text-muted-foreground hover:bg-foreground/[0.035] hover:text-foreground",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "bg-custom-primary absolute inset-y-0 start-0 w-[2px] transition-transform duration-300",
                            selected ? "scale-y-100" : "scale-y-0",
                          )}
                        />

                        <span className="truncate">{tag.label}</span>

                        <Check
                          className={cn(
                            "size-4 shrink-0 transition-all duration-200",
                            selected
                              ? "text-custom-primary scale-100 opacity-100"
                              : "scale-75 opacity-0",
                          )}
                          strokeWidth={1.8}
                        />
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Create Tag */}
              <div className="border-border-secondary border-t p-2">
                <AnimatePresence initial={false} mode="wait">
                  {!creating ? (
                    <motion.button
                      key="create-button"
                      type="button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setCreating(true)}
                      className="text-custom-primary hover:bg-custom-primary/[0.06] flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition-colors"
                    >
                      <Plus className="size-4" strokeWidth={1.7} />

                      {t("forms.parentNews.createTag")}
                    </motion.button>
                  ) : (
                    <motion.div
                      key="create-form"
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 p-1">
                        <input
                          lang={lang}
                          value={newTag}
                          onChange={(event) => setNewTag(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              createTag();
                            }

                            if (event.key === "Escape") {
                              setCreating(false);
                              setNewTag("");
                            }
                          }}
                          autoFocus
                          placeholder={t("forms.parentNews.tagNamePlaceholder")}
                          className="border-border-secondary bg-background text-foreground focus:border-custom-primary h-11 w-full border px-3 text-sm transition-colors outline-none"
                        />

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setCreating(false);
                              setNewTag("");
                            }}
                            className="border-border-secondary text-muted-foreground hover:bg-foreground/[0.035] hover:text-foreground cursor-pointer border px-4 py-2 text-xs transition-colors"
                          >
                            {t("forms.parentNews.cancel")}
                          </button>

                          <button
                            type="button"
                            onClick={createTag}
                            disabled={!newTag.trim()}
                            className={cn(
                              "bg-custom-primary px-4 py-2 text-xs font-semibold text-white transition-opacity",
                              !newTag.trim()
                                ? "cursor-not-allowed opacity-40"
                                : "cursor-pointer hover:opacity-90",
                            )}
                          >
                            {t("forms.parentNews.save")}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
