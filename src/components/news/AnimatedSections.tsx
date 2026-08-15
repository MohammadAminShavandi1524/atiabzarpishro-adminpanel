"use client";

import { ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

interface AnimatedSectionsProps {
  children: ReactNode;
  sectionKey: string;
  direction: 1 | -1;
}

export default function AnimatedSections({
  children,
  sectionKey,
  direction,
}: AnimatedSectionsProps) {
  const locale = useLocale();

  const isRTL = ["fa", "ar"].includes(locale);

  const slide = (isRTL ? -direction : direction) * 70;

  return (
    <div className="relative min-h-[666px] overflow-hidden">
      <AnimatePresence initial={false} mode="sync" custom={slide}>
        <motion.div
          key={sectionKey}
          custom={slide}
          className="absolute inset-0"
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
              stiffness: 110,
              damping: 20,
              mass: 1.2,
            },
            opacity: {
              duration: 0.35,
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
