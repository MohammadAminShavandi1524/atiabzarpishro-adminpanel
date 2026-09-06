"use client";

import { type ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useLocale } from "next-intl";

interface AnimatedFormProps {
  children: ReactNode;

  formKey: string;

  direction: 1 | -1;
}

export default function AnimatedForm({
  children,
  formKey,
  direction,
}: AnimatedFormProps) {
  const locale = useLocale();

  const isRTL = locale === "fa";

  const slide = (isRTL ? -direction : direction) * 45;

  return (
    <div className="3xl:mt-7 relative mt-7 flex min-h-0 w-full flex-1 overflow-hidden xl:mt-4 2xl:mt-5">
      <AnimatePresence initial={false} mode="wait" custom={slide}>
        <motion.div
          key={formKey}
          custom={slide}
          initial={{
            x: slide,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: -slide,
            opacity: 0,
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 130,
              damping: 24,
              mass: 0.9,
            },
            opacity: {
              duration: 0.25,
              ease: "easeOut",
            },
          }}
          className="flex min-h-0 w-full flex-1 overflow-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
