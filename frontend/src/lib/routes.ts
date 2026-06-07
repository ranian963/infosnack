export type RouteIcon =
  | "admin"
  | "auth"
  | "capture"
  | "chat"
  | "digests"
  | "home"
  | "library"
  | "search"
  | "settings"
  | "share"
  | "sources"

export type RouteGroup = "auth" | "primary" | "public" | "settings"

export type AppRoute = {
  readonly key: string
  readonly id: string
  readonly path: string
  readonly samplePath: string
  readonly messageKey: string
  readonly group: RouteGroup
  readonly icon: RouteIcon
  readonly showInNav: boolean
}

export const APP_ROUTE_BY_KEY = {
  home: {
    key: "home",
    id: "H-01",
    path: "/",
    samplePath: "/",
    messageKey: "home",
    group: "primary",
    icon: "home",
    showInNav: true,
  },
  login: {
    key: "login",
    id: "A-01",
    path: "/login",
    samplePath: "/login",
    messageKey: "login",
    group: "auth",
    icon: "auth",
    showInNav: true,
  },
  invite: {
    key: "invite",
    id: "A-02",
    path: "/register/invite",
    samplePath: "/register/invite",
    messageKey: "invite",
    group: "auth",
    icon: "auth",
    showInNav: true,
  },
  capture: {
    key: "capture",
    id: "CAP-01",
    path: "/capture",
    samplePath: "/capture",
    messageKey: "capture",
    group: "primary",
    icon: "capture",
    showInNav: true,
  },
  library: {
    key: "library",
    id: "L-01",
    path: "/library",
    samplePath: "/library",
    messageKey: "library",
    group: "primary",
    icon: "library",
    showInNav: true,
  },
  contentDetail: {
    key: "contentDetail",
    id: "L-02",
    path: "/library/[contentId]",
    samplePath: "/library/sample-content",
    messageKey: "contentDetail",
    group: "primary",
    icon: "library",
    showInNav: true,
  },
  sources: {
    key: "sources",
    id: "AC-01",
    path: "/sources",
    samplePath: "/sources",
    messageKey: "sources",
    group: "primary",
    icon: "sources",
    showInNav: true,
  },
  sourceNew: {
    key: "sourceNew",
    id: "AC-02",
    path: "/sources/new",
    samplePath: "/sources/new",
    messageKey: "sourceNew",
    group: "primary",
    icon: "sources",
    showInNav: true,
  },
  sourceDetail: {
    key: "sourceDetail",
    id: "AC-03",
    path: "/sources/[sourceId]",
    samplePath: "/sources/sample-source",
    messageKey: "sourceDetail",
    group: "primary",
    icon: "sources",
    showInNav: true,
  },
  search: {
    key: "search",
    id: "SR-01",
    path: "/search",
    samplePath: "/search",
    messageKey: "search",
    group: "primary",
    icon: "search",
    showInNav: true,
  },
  chat: {
    key: "chat",
    id: "C-01",
    path: "/chat",
    samplePath: "/chat",
    messageKey: "chat",
    group: "primary",
    icon: "chat",
    showInNav: true,
  },
  digests: {
    key: "digests",
    id: "D-01",
    path: "/digests",
    samplePath: "/digests",
    messageKey: "digests",
    group: "primary",
    icon: "digests",
    showInNav: true,
  },
  digestDetail: {
    key: "digestDetail",
    id: "D-02",
    path: "/digests/[digestId]",
    samplePath: "/digests/sample-digest",
    messageKey: "digestDetail",
    group: "primary",
    icon: "digests",
    showInNav: true,
  },
  digestCuration: {
    key: "digestCuration",
    id: "D-03",
    path: "/digests/[digestId]/curation",
    samplePath: "/digests/sample-digest/curation",
    messageKey: "digestCuration",
    group: "primary",
    icon: "digests",
    showInNav: true,
  },
  publicShare: {
    key: "publicShare",
    id: "P-01",
    path: "/shares/[token]",
    samplePath: "/shares/sample-token",
    messageKey: "publicShare",
    group: "public",
    icon: "share",
    showInNav: true,
  },
  admin: {
    key: "admin",
    id: "AD-01",
    path: "/admin",
    samplePath: "/admin",
    messageKey: "admin",
    group: "primary",
    icon: "admin",
    showInNav: true,
  },
  settingsProfile: {
    key: "settingsProfile",
    id: "S-01",
    path: "/settings/profile",
    samplePath: "/settings/profile",
    messageKey: "settingsProfile",
    group: "settings",
    icon: "settings",
    showInNav: true,
  },
  settingsWorkspace: {
    key: "settingsWorkspace",
    id: "S-02",
    path: "/settings/workspace",
    samplePath: "/settings/workspace",
    messageKey: "settingsWorkspace",
    group: "settings",
    icon: "settings",
    showInNav: true,
  },
  settingsCredentials: {
    key: "settingsCredentials",
    id: "S-03",
    path: "/settings/credentials",
    samplePath: "/settings/credentials",
    messageKey: "settingsCredentials",
    group: "settings",
    icon: "settings",
    showInNav: true,
  },
  settingsNotifications: {
    key: "settingsNotifications",
    id: "S-04",
    path: "/settings/notifications",
    samplePath: "/settings/notifications",
    messageKey: "settingsNotifications",
    group: "settings",
    icon: "settings",
    showInNav: true,
  },
  settingsExport: {
    key: "settingsExport",
    id: "S-05",
    path: "/settings/export",
    samplePath: "/settings/export",
    messageKey: "settingsExport",
    group: "settings",
    icon: "settings",
    showInNav: true,
  },
  settingsWebhooks: {
    key: "settingsWebhooks",
    id: "S-06",
    path: "/settings/webhooks",
    samplePath: "/settings/webhooks",
    messageKey: "settingsWebhooks",
    group: "settings",
    icon: "settings",
    showInNav: true,
  },
} as const satisfies Record<string, AppRoute>

export type RouteKey = keyof typeof APP_ROUTE_BY_KEY

export const APP_ROUTES = Object.values(APP_ROUTE_BY_KEY)
export const currentReleaseRoutes = APP_ROUTES.map((route) => route.path)

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function routeMatchesPath(route: AppRoute, pathname: string): boolean {
  if (route.samplePath === pathname || route.path === pathname) {
    return true
  }

  if (!route.path.includes("[")) {
    return false
  }

  const pattern = route.path
    .split("/")
    .map((segment) =>
      segment.startsWith("[") && segment.endsWith("]") ? "[^/]+" : escapeRegExp(segment),
    )
    .join("/")

  return new RegExp(`^${pattern}$`).test(pathname)
}

export function getRouteForPathname(pathname: string): AppRoute {
  for (const route of APP_ROUTES) {
    if (routeMatchesPath(route, pathname)) {
      return route
    }
  }

  return APP_ROUTE_BY_KEY.home
}
