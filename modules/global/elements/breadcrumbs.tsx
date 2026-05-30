/* app/components/AutoBreadcrumbs.tsx */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import SvgIcon from "../icons/svg_icons";

type AutoBreadcrumbsProps = {
  /** Segments whose labels should be hidden (kept in href). */
  ignoreDisplay?: string[];

  /** Skip the first N URL segments entirely. */
  startDepth?: number;

  /** Always render the Home crumb? */
  showHome?: boolean;

  /** If Home is also the active page, still render it? */
  showHomeWhenActive?: boolean;

  /** Custom label / href for the Home crumb. */
  homeLabel?: string;
  homeHref?: string;
  homeIconName?: string;
  homeIconClass?: string;

  /** Styling hooks */
  containerClassName?: string;
  linkClassName?: string;
  activeClassName?: string;

  /** Separator element (text or JSX) */
  separator?: ReactNode;
};

type Crumb = { href: string; label: string };

const toTitleCase = (text: string) => text.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function AutoBreadcrumbs({
  ignoreDisplay = ["v1", "v2", "v3", "v4"],
  startDepth = 0,
  showHome = true,
  showHomeWhenActive = false,
  homeLabel = "Home",
  homeHref = "/",
  homeIconName = "",
  homeIconClass = "size-4",
  containerClassName = "flex flex-wrap items-center gap-1 text-sm",
  linkClassName = "hover:underline text-gray-500",
  activeClassName = "font-medium text-blue-950",
  separator = <SvgIcon name="keyboard_double_arrow_right" className="size-4" />,
}: AutoBreadcrumbsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const ignoreSet = new Set(ignoreDisplay);

  /* ---------- Build crumbs with full hrefs ---------- */
  const crumbs: Crumb[] = [];
  let fullHref = "";
  segments.forEach((seg, i) => {
    fullHref += `/${seg}`;
    if (i >= startDepth && !ignoreSet.has(seg)) {
      crumbs.push({ href: fullHref, label: toTitleCase(decodeURIComponent(seg)) });
    }
  });

  const isHomeActive = pathname === "/" || crumbs.length === 0;
  const renderHome = showHome && (!isHomeActive || (isHomeActive && showHomeWhenActive));

  return (
    <nav aria-label="breadcrumb" className={`${crumbs.length === 0 && "hidden"} ${containerClassName}`}>
      {/* --------- Home crumb --------- */}
      {renderHome && (
        <>
          {homeIconName && <SvgIcon name={homeIconName} className={homeIconClass} />}
          {isHomeActive ? (
            <span className={activeClassName}>{toTitleCase(homeLabel)}</span>
          ) : (
            <Link href={homeHref} className={linkClassName}>
              {toTitleCase(homeLabel)}
            </Link>
          )}
          {crumbs.length > 0 && <span className="mx-1">{separator}</span>}
        </>
      )}
      {/* --------- Other crumbs --------- */}
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1">
          {i > 0 && <>{separator} </>}
          {i === crumbs.length - 1 ? (
            <span className={activeClassName}>{c.label}</span>
          ) : (
            <Link href={c.href} className={linkClassName}>
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
