"use client";

import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

interface NavLinkProps {
  readonly href: string;
  readonly active?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
  readonly onClick?: MouseEventHandler<HTMLAnchorElement> | MouseEventHandler<HTMLButtonElement>;
  readonly buttonOnClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function NavLink({
  href,
  active = false,
  className = "",
  onClick,
  buttonOnClick,
  children,
}: NavLinkProps) {
  const baseClasses =
    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ";
  const activeClasses =
    "border-indigo-400 text-gray-900 focus:border-indigo-700";
  const inactiveClasses =
    "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700";

  // If buttonOnClick is provided, render a button for accessibility; otherwise, render a link
  if (buttonOnClick) {
    return (
      <button
        type="button"
        onClick={buttonOnClick}
        className={`${baseClasses}${active ? activeClasses : inactiveClasses} ${className}`}
      >
        {children}
      </button>
    );
  }

  // If onClick is provided without navigation, render a button for accessibility
  if (onClick && (!href || href === "#")) {
    return (
      <button
        type="button"
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        className={`${baseClasses}${active ? activeClasses : inactiveClasses} ${className}`}
        aria-pressed={active}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} legacyBehavior passHref>
      <a
        href={href}
        className={`${baseClasses}${active ? activeClasses : inactiveClasses} ${className}`}
      >
        {children}
      </a>
    </Link>
  );
}
