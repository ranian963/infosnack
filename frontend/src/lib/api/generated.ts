export const healthStatuses = ["ok", "degraded", "down"] as const
export type HealthStatus = (typeof healthStatuses)[number]
export const dependencyStatuses = ["ok", "degraded", "down"] as const
export type DependencyStatus = (typeof dependencyStatuses)[number]
export type HealthResponse = {
  readonly status: HealthStatus
  readonly dependencies: Readonly<Record<string, DependencyStatus>>
}
export const operations = {
  getHealth: {
    method: "GET",
    path: "/api/health",
    operationId: "getHealth",
  },
} as const
