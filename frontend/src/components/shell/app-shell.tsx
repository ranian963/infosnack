"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"

import { APP_ROUTES, getRouteForPathname } from "@/lib/routes"

import { RouteIconGlyph } from "./route-icons"

type AppShellProps = {
  readonly children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const routeT = useTranslations("routes")
  const shellT = useTranslations("shell")
  const brandT = useTranslations("brand")
  const activeRoute = getRouteForPathname(pathname)

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label={shellT("sidebarLabel")}>
        <Link className="brand-lockup" href="/" data-sidebar-route="home">
          <Image
            alt={brandT("logoAlt")}
            className="brand-mark"
            height={32}
            src="/brand/logo-outline-kr.png"
            width={96}
          />
          <span>{brandT("name")}</span>
        </Link>
        <nav className="route-nav">
          {APP_ROUTES.filter((route) => route.showInNav).map((route) => (
            <Link
              className="nav-link"
              data-active={activeRoute.key === route.key}
              data-sidebar-route={route.key}
              href={route.samplePath}
              key={route.key}
            >
              <RouteIconGlyph className="nav-icon" name={route.icon} />
              <span>{routeT(`${route.messageKey}.nav`)}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">{shellT("status")}</div>
      </aside>
      <div className="main-surface">{children}</div>
    </div>
  )
}
