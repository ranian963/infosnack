import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { parse } from "yaml"

const projectRoot = new URL("..", import.meta.url).pathname
const repoRoot = join(projectRoot, "..")
const contractPath = join(repoRoot, "docs/openapi/infosnack-api.yaml")
const outputPath = join(projectRoot, "src/lib/api/generated.ts")
const contract = parse(readFileSync(contractPath, "utf8"))
const health = contract.components.schemas.HealthResponse
const statusValues = health.properties.status.enum
const dependencyValues = health.properties.dependencies.additionalProperties.enum
const getHealth = contract.paths["/api/health"].get

function literalUnion(values) {
  return values.map((value) => JSON.stringify(value)).join(", ")
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(
  outputPath,
  [
    `export const healthStatuses = [${literalUnion(statusValues)}] as const`,
    "export type HealthStatus = (typeof healthStatuses)[number]",
    `export const dependencyStatuses = [${literalUnion(dependencyValues)}] as const`,
    "export type DependencyStatus = (typeof dependencyStatuses)[number]",
    "export type HealthResponse = {",
    "  readonly status: HealthStatus",
    "  readonly dependencies: Readonly<Record<string, DependencyStatus>>",
    "}",
    "export const operations = {",
    "  getHealth: {",
    `    method: ${JSON.stringify("GET")},`,
    `    path: ${JSON.stringify("/api/health")},`,
    `    operationId: ${JSON.stringify(getHealth.operationId)},`,
    "  },",
    "} as const",
    "",
  ].join("\n"),
)

console.log(`generated ${outputPath}`)
