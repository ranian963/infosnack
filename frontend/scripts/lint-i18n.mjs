import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"

const projectRoot = new URL("..", import.meta.url).pathname
const koMessages = JSON.parse(readFileSync(join(projectRoot, "messages/ko.json"), "utf8"))
const enMessages = JSON.parse(readFileSync(join(projectRoot, "messages/en.json"), "utf8"))
const srcRoot = join(projectRoot, "src")

function collectKeys(value, prefix = "") {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [prefix]
  }

  return Object.entries(value).flatMap(([key, child]) =>
    collectKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

const koKeys = new Set(collectKeys(koMessages))
const enKeys = new Set(collectKeys(enMessages))
const missingInEnglish = [...koKeys].filter((key) => !enKeys.has(key))
const missingInKorean = [...enKeys].filter((key) => !koKeys.has(key))

if (missingInEnglish.length > 0 || missingInKorean.length > 0) {
  console.error("i18n message keys are out of sync")
  for (const key of missingInEnglish) {
    console.error(`missing in en.json: ${key}`)
  }
  for (const key of missingInKorean) {
    console.error(`missing in ko.json: ${key}`)
  }
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

function hasVisibleLiteral(value) {
  return /[가-힣]/.test(value) || /[A-Za-z]{3,}/.test(value)
}

const visibleAttributeNames = new Set(["aria-label", "alt", "placeholder", "title"])
const violations = []

for (const file of walk(srcRoot)) {
  const source = readFileSync(file, "utf8")
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )

  function visit(node) {
    if (ts.isJsxText(node)) {
      const text = node.getText(sourceFile).replace(/\s+/g, " ").trim()
      if (text.length > 0 && hasVisibleLiteral(text)) {
        violations.push(`${file}: visible JSX literal "${text}"`)
      }
    }

    if (
      ts.isJsxAttribute(node) &&
      visibleAttributeNames.has(node.name.getText(sourceFile)) &&
      node.initializer !== undefined &&
      ts.isStringLiteral(node.initializer)
    ) {
      const text = node.initializer.text.trim()
      if (text.length > 0 && hasVisibleLiteral(text)) {
        violations.push(`${file}: visible attribute literal "${text}"`)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
}

if (violations.length > 0) {
  console.error("hardcoded user-visible copy found")
  for (const violation of violations) {
    console.error(violation)
  }
  process.exit(1)
}

console.log("PASS i18n")
