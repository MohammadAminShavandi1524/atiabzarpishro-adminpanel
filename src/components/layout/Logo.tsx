"use client";

import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LogoProps {
  size?: number;
}

const Logo = ({ size }: LogoProps) => {
  const locale = useLocale();

  return (
    <Link
      className={`min-h-${size ? size : 16} flex items-center justify-center`}
      href={`/${locale}`}
    >
      <Image
        src="/logo.webp"
        alt="logo"
        width={size ? size * 4 : 64}
        height={size ? size * 4 : 64}
      />
    </Link>
  );
};

export default Logo;
