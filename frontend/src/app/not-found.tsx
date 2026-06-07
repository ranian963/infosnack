import Link from "next/link"
import { getTranslations } from "next-intl/server"

export default async function NotFoundPage() {
  const t = await getTranslations("common")
  return (
    <main className="page-card">
      <h1 className="hero-title">{t("notFoundTitle")}</h1>
      <p className="hero-copy">{t("notFoundBody")}</p>
      <Link href="/library">{t("goLibrary")}</Link>
    </main>
  )
}
