"use client";

import Image from "next/image";
import { HTMLAttributes } from "react";

interface ApplicationLogoProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function ApplicationLogo({ className, ...props }: ApplicationLogoProps) {
  return (
    <div className={className} {...props} suppressHydrationWarning>
      <Image
        src="/logo.png"
        alt="Logo da Aplicação"
        width={36}
        height={36}
        priority
      />
    </div>
  );
}
