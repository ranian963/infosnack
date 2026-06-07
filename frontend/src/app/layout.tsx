import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import type { ReactNode } from "react"

import { AppProviders } from "@/components/providers/app-providers"
import { AppShell } from "@/components/shell/app-shell"

import "./globals.css"

export const metadata: Metadata = {
  title: "InfoSnack",
}

type RootLayoutProps = {
  readonly children: ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <AppShell>{children}</AppShell>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
