"use client";

import Image from "next/image";
import { HTMLAttributes } from "react";

interface ApplicationLogoProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function ApplicationLogo({ className, ...props }: Readonly<ApplicationLogoProps>) {
  return (
    <div className={className} {...props} suppressHydrationWarning>
      <Image
        src="/logos.png"
        alt="Logo"
        width={36}
        height={36}
        priority
      />
    </div>
  );
}