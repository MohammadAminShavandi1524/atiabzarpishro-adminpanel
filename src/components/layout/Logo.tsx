"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}`}
      className="flex size-14 shrink-0 items-center justify-center 2xl:size-16"
    >
      <Image
        src="/logo.webp"
        alt="ATI Abzar Pishro"
        width={64}
        height={64}
        priority
        className="h-full w-full object-contain"
      />
    </Link>
  );
};

export default Logo;
