import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import type { AppRoute } from "@/lib/routes"
import { APP_ROUTES } from "@/lib/routes"

import { RouteIconGlyph, statusIcons } from "./route-icons"

type PlaceholderPageProps = {
  readonly route: AppRoute
}

export async function PlaceholderPage({ route }: PlaceholderPageProps) {
  const routeT = await getTranslations("routes")
  const placeholderT = await getTranslations("placeholder")
  const brandT = await getTranslations("brand")
  const ContractIcon = statusIcons.contract
  const GuardIcon = statusIcons.guard
  const ApiIcon = statusIcons.api

  return (
    <main className="page-card" data-route-id={route.id}>
      <section className="hero-band">
        <div>
          <p className="eyebrow">{route.id}</p>
          <h1 className="hero-title">{routeT(`${route.messageKey}.title`)}</h1>
          <p className="hero-copy">{routeT(`${route.messageKey}.description`)}</p>
        </div>
        <Image
          alt={brandT("mascotAlt")}
          className="mascot"
          height={142}
          priority={route.key === "home"}
          src="/brand/mascot-snackbag.png"
          width={120}
        />
      </section>

      <section className="status-grid" aria-label={placeholderT("statusRegion")}>
        <div className="status-card">
          <p className="status-label">
            <ApiIcon aria-hidden="true" className="nav-icon" /> {placeholderT("apiLabel")}
          </p>
          <p className="status-value">{placeholderT("apiValue")}</p>
        </div>
        <div className="status-card">
          <p className="status-label">
            <ContractIcon aria-hidden="true" className="nav-icon" /> {placeholderT("contractLabel")}
          </p>
          <p className="status-value">{route.path}</p>
        </div>
        <div className="status-card">
          <p className="status-label">
            <GuardIcon aria-hidden="true" className="nav-icon" /> {placeholderT("guardLabel")}
          </p>
          <p className="status-value">{placeholderT("guardValue")}</p>
        </div>
      </section>

      <section className="route-map" aria-label={placeholderT("mapRegion")}>
        <div className="route-map-head">
          <h2>{placeholderT("mapTitle")}</h2>
          <p>{placeholderT("mapDescription")}</p>
        </div>
        <div className="route-grid">
          {APP_ROUTES.map((item) => (
            <Link
              className="route-card"
              data-route-link={item.key}
              href={item.samplePath}
              key={item.key}
            >
              <RouteIconGlyph className="nav-icon" name={item.icon} />
              <span>{routeT(`${item.messageKey}.nav`)}</span>
              <span className="route-path">{item.path}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
