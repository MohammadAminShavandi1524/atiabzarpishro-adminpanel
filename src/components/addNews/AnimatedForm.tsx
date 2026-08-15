"use client";

import { ReactNode } from "react";
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
    <div className="relative mt-7 min-h-[520px] overflow-hidden">
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
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
