#!/usr/bin/env node

import { readFile } from "node:fs/promises"
import { extname, join } from "node:path"
import process from "node:process"

function usage() {
  console.log("Usage: node scripts/compare-build-benchmarks.mjs <baseline-results.json> <candidate-results.json>")
}

async function readReport(path) {
  const filePath = extname(path) === ".json" ? path : join(path, "results.json")
  const report = JSON.parse(await readFile(filePath, "utf8"))

  if (report.status !== "success") {
    throw new Error(`${filePath}: benchmark status is ${report.status}; use a successful result`)
  }

  return report
}

function seconds(milliseconds) {
  return (milliseconds / 1000).toFixed(3)
}

if (process.argv.length !== 4) {
  usage()
  process.exit(1)
}

try {
  const [baseline, candidate] = await Promise.all(process.argv.slice(2).map(readReport))
  const targets = ["backend", "frontend"].filter(target => baseline.targets[target]?.summary && candidate.targets[target]?.summary)

  if (!targets.length) {
    throw new Error("The reports have no common targets with successful measured runs")
  }

  console.log(`Baseline: ${baseline.label}`)
  console.log(`Candidate: ${candidate.label}`)
  console.log("")
  console.log("| Target | Baseline median (s) | Candidate median (s) | Change | Speedup |")
  console.log("| --- | ---: | ---: | ---: | ---: |")

  for (const target of targets) {
    const before = baseline.targets[target].summary.medianMs
    const after = candidate.targets[target].summary.medianMs
    const change = (after - before) / before * 100
    const speedup = before / after
    const sign = change > 0 ? "+" : ""

    console.log(`| ${target} | ${seconds(before)} | ${seconds(after)} | ${sign}${change.toFixed(1)}% | ${speedup.toFixed(2)}x |`)
  }

  console.log("\nNegative change is faster. Speedup above 1.00x means the candidate is faster.")
}
catch (error) {
  console.error(`Cannot compare benchmarks: ${error.message}`)
  process.exitCode = 1
}
