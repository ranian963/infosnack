import { describe, expect, it } from "vitest"
import { pathWithoutLeadingSlash } from "./client"
import { operations } from "./generated"

describe("generated API client metadata", () => {
  it("imports the getHealth operation from the generated contract module", () => {
    expect(operations.getHealth).toEqual({
      method: "GET",
      operationId: "getHealth",
      path: "/api/health",
    })
  })

  it("normalizes OpenAPI paths for ky prefixUrl requests", () => {
    expect(pathWithoutLeadingSlash("/api/health")).toBe("api/health")
  })
})
