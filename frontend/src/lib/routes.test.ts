import { describe, expect, it } from "vitest"

import { APP_ROUTES } from "./routes"

const expectedPaths = [
  "/",
  "/login",
  "/register/invite",
  "/capture",
  "/library",
  "/library/[contentId]",
  "/sources",
  "/sources/new",
  "/sources/[sourceId]",
  "/search",
  "/chat",
  "/digests",
  "/digests/[digestId]",
  "/digests/[digestId]/curation",
  "/shares/[token]",
  "/admin",
  "/settings/profile",
  "/settings/workspace",
  "/settings/credentials",
  "/settings/notifications",
  "/settings/export",
  "/settings/webhooks",
] as const

describe("app route registry", () => {
  it("lists every current-release screen route from the screen spec", () => {
    const actualPaths = APP_ROUTES.map((route) => route.path)

    expect(actualPaths).toEqual(expectedPaths)
  })

  it("provides a concrete sample path for every dynamic route", () => {
    const dynamicRoutes = APP_ROUTES.filter((route) => route.path.includes("["))

    expect(dynamicRoutes.every((route) => !route.samplePath.includes("["))).toBe(true)
  })
})
