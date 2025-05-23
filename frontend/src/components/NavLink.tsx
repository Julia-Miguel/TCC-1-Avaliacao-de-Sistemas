// src/components/NavLink.tsx
"use client";

import Link from "next/link";

interface NavLinkProps {
  readonly href: string;
  readonly active?: boolean;
  readonly className?: string;
  readonly children: React.ReactNode;
}

export default function NavLink({
  href,
  active = false,
  className = "",
  children,
}: NavLinkProps) {
  const baseClasses =
    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ";
  const activeClasses =
    "border-indigo-400 text-gray-900 focus:border-indigo-700";
  const inactiveClasses =
    "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700";

  return (
    <Link href={href} className={baseClasses + (active ? activeClasses : inactiveClasses) + " " + className}>
      {children}
    </Link>
  );
}
