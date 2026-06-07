import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const projectRoot = new URL("..", import.meta.url).pathname
const requiredFiles = [
  "src/app/globals.css",
  "src/components/providers/app-providers.tsx",
  "src/components/ui/button.tsx",
  "src/lib/utils.ts",
]

for (const file of requiredFiles) {
  readFileSync(join(projectRoot, file), "utf8")
}

const css = readFileSync(join(projectRoot, "src/app/globals.css"), "utf8")
if (!css.includes("@theme") || !css.includes("--radius")) {
  console.error("design-system guard failed")
  console.error("missing theme tokens")
  process.exit(1)
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      return walk(path)
    }
    return entry.isFile() && path.endsWith(".tsx") ? [path] : []
  })
}

const forbiddenPatterns = [
  /\brounded-(?:xl|2xl|3xl)\b/,
  /\bshadow-(?:sm|md|lg|xl|2xl|\[[^\]]+\])\b/,
  /\b(?:bg|text|border)-\[#/u,
  /\btext-\[[^\]]+\]/,
  /\boutline-none\b/,
  /\btransition-all\b/,
]

const violations = []
for (const file of walk(join(projectRoot, "src"))) {
  const source = readFileSync(file, "utf8")
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      violations.push(`${file}: ${pattern}`)
    }
  }
}

if (violations.length > 0) {
  console.error("design-system guard failed")
  for (const violation of violations) {
    console.error(violation)
  }
  process.exit(1)
}

console.log("PASS design-system")
