import ky from "ky"
import type { HealthResponse } from "./generated"
import { operations } from "./generated"

const { NEXT_PUBLIC_API_BASE_URL: configuredApiBaseUrl } = process.env
const apiBaseUrl = configuredApiBaseUrl ?? "http://localhost:8001"

export const apiClient = ky.create({
  credentials: "include",
  prefix: apiBaseUrl.replace(/\/+$/, ""),
})

export function pathWithoutLeadingSlash(path: string): string {
  return path.startsWith("/") ? path.slice(1) : path
}

export async function getHealth(): Promise<HealthResponse> {
  return apiClient.get(pathWithoutLeadingSlash(operations.getHealth.path)).json<HealthResponse>()
}
