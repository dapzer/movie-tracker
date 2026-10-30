#!/usr/bin/env node

import { execFile, spawn } from "node:child_process"
import { createWriteStream, existsSync } from "node:fs"
import { mkdir, rm, writeFile } from "node:fs/promises"
import { arch, cpus, hostname, platform, release, totalmem, type } from "node:os"
import { join, relative, resolve } from "node:path"
import process from "node:process"
import { finished } from "node:stream/promises"
import { fileURLToPath } from "node:url"
import { parseArgs, promisify } from "node:util"

const execFileAsync = promisify(execFile)
const rootDir = fileURLToPath(new URL("../", import.meta.url))
const allowedTargets = ["backend", "frontend"]
const buildOutputs = [
  "apps/backend/dist",
  "apps/frontend/.data",
  "apps/frontend/.nitro",
  "apps/frontend/.nuxt",
  "apps/frontend/.output",
  "packages/database/dist",
  "packages/email-templates/dist",
  "packages/types/dist",
  "packages/utils/dist",
]

const help = `
Benchmark backend and frontend builds without measuring dependency installation.

Usage:
  node scripts/benchmark-builds.mjs [options]

Options:
  --runs <number>       Measured runs per target (default: 3)
  --targets <list>      Comma-separated targets: backend,frontend (default: both)
  --label <name>        Machine name stored in the report (default: hostname)
  --output <directory>  Results directory (default: benchmark-results)
  --no-warmup           Skip one unmeasured warmup run per target
  -h, --help            Show this help

Examples:
  node scripts/benchmark-builds.mjs --label current-pc
  node scripts/benchmark-builds.mjs --runs 5 --targets frontend --label mac
`

function fail(message) {
  throw new Error(message)
}

function round(value) {
  return Math.round(value * 1000) / 1000
}

function sanitize(value) {
  return value.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "benchmark"
}

function stats(durations) {
  if (!durations.length) {
    return null
  }

  const sorted = [...durations].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  const median = sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2

  return {
    minMs: round(sorted[0]),
    maxMs: round(sorted.at(-1)),
    meanMs: round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length),
    medianMs: round(median),
  }
}

async function commandOutput(command, args) {
  const { stdout } = await execFileAsync(command, args, { cwd: rootDir })
  return stdout.trim()
}

async function optionalCommandOutput(command, args) {
  try {
    return await commandOutput(command, args)
  }
  catch {
    return null
  }
}

async function cleanBuildOutputs() {
  await Promise.all(buildOutputs.map(path => rm(join(rootDir, path), { force: true, recursive: true })))
}

async function runBuild(target, logPath) {
  const logStream = createWriteStream(logPath)
  const startedAt = process.hrtime.bigint()
  let child

  try {
    child = spawn("pnpm", [
      "exec",
      "dotenv",
      "--",
      "turbo",
      "run",
      "build",
      `--filter=${target}`,
      "--force",
      "--concurrency=1",
    ], {
      cwd: rootDir,
      env: {
        ...process.env,
        NO_COLOR: "1",
        NUXT_TELEMETRY_DISABLED: "1",
        TURBO_TELEMETRY_DISABLED: "1",
      },
      stdio: ["ignore", "pipe", "pipe"],
    })

    child.stdout.on("data", (chunk) => {
      logStream.write(chunk)
      process.stdout.write(chunk)
    })
    child.stderr.on("data", (chunk) => {
      logStream.write(chunk)
      process.stderr.write(chunk)
    })

    const exitCode = await new Promise((resolvePromise, rejectPromise) => {
      child.once("error", rejectPromise)
      child.once("close", resolvePromise)
    })

    return {
      durationMs: Number(process.hrtime.bigint() - startedAt) / 1e6,
      exitCode,
    }
  }
  finally {
    logStream.end()
    await finished(logStream)
  }
}

function csvReport(report) {
  const lines = ["target,iteration,duration_ms,duration_s,status"]

  for (const target of report.options.targets) {
    for (const run of report.targets[target].runs) {
      lines.push([
        target,
        run.iteration,
        run.durationMs,
        round(run.durationMs / 1000),
        run.status,
      ].join(","))
    }
  }

  return `${lines.join("\n")}\n`
}

function markdownReport(report) {
  const lines = [
    `# Build benchmark: ${report.label}`,
    "",
    `- Status: ${report.status}`,
    `- Runtime: ${report.machine.runtime}`,
    `- OS: ${report.machine.os} ${report.machine.osRelease} (${report.machine.arch})`,
    `- CPU: ${report.machine.cpuModel}, ${report.machine.logicalCores} logical cores`,
    `- Memory: ${report.machine.memoryGiB} GiB`,
    `- Node.js: ${report.machine.node}`,
    `- pnpm: ${report.machine.pnpm ?? "unknown"}`,
    `- Git commit: ${report.machine.gitCommit ?? "unknown"}`,
    `- Measured runs per target: ${report.options.runs}`,
    `- Warmup: ${report.options.warmup ? "yes" : "no"}`,
    "",
    "Only build time is measured. Dependency installation and output cleanup are excluded.",
    "Turbo cache is bypassed and build outputs are removed before every run.",
    "",
    "| Target | Runs (s) | Min (s) | Median (s) | Mean (s) | Max (s) |",
    "| --- | --- | ---: | ---: | ---: | ---: |",
  ]

  for (const target of report.options.targets) {
    const targetReport = report.targets[target]
    const summary = targetReport.summary
    const runs = targetReport.runs
      .filter(run => run.status === "success")
      .map(run => round(run.durationMs / 1000).toFixed(3))
      .join(", ")

    lines.push(`| ${target} | ${runs || "—"} | ${summary ? (summary.minMs / 1000).toFixed(3) : "—"} | ${summary ? (summary.medianMs / 1000).toFixed(3) : "—"} | ${summary ? (summary.meanMs / 1000).toFixed(3) : "—"} | ${summary ? (summary.maxMs / 1000).toFixed(3) : "—"} |`)
  }

  if (report.error) {
    lines.push("", `Error: ${report.error}`)
  }

  return `${lines.join("\n")}\n`
}

let options

try {
  const { values } = parseArgs({
    options: {
      "runs": { type: "string", default: "3" },
      "targets": { type: "string", default: allowedTargets.join(",") },
      "label": { type: "string" },
      "output": { type: "string", default: "benchmark-results" },
      "no-warmup": { type: "boolean", default: false },
      "help": { type: "boolean", short: "h", default: false },
    },
  })

  if (values.help) {
    console.log(help.trim())
    process.exit(0)
  }

  const runs = Number(values.runs)
  if (!Number.isInteger(runs) || runs < 1) {
    fail("--runs must be a positive integer")
  }

  const targets = [...new Set(values.targets.split(",").map(target => target.trim()).filter(Boolean))]
  if (!targets.length || targets.some(target => !allowedTargets.includes(target))) {
    fail(`--targets must contain only: ${allowedTargets.join(", ")}`)
  }

  const runtime = process.env.BENCHMARK_RUNTIME || "local"
  options = {
    runs,
    targets,
    warmup: !values["no-warmup"],
    label: values.label || `${runtime === "docker" ? "docker-" : ""}${hostname()}`,
    output: values.output,
    runtime,
  }
}
catch (error) {
  console.error(error.message)
  console.error(help.trim())
  process.exit(1)
}

if (!existsSync(join(rootDir, "node_modules"))) {
  console.error("Dependencies are not installed. Run `pnpm install --frozen-lockfile` first; installation is not part of the benchmark.")
  process.exit(1)
}

const runId = `${new Date().toISOString().replace(/[:.]/g, "-")}-${sanitize(options.label)}`
const outputDir = resolve(rootDir, options.output, runId)
const logsDir = join(outputDir, "logs")
await mkdir(logsDir, { recursive: true })

const cpuList = cpus()
const report = {
  schemaVersion: 1,
  label: options.label,
  createdAt: new Date().toISOString(),
  status: "running",
  options: {
    runs: options.runs,
    targets: options.targets,
    warmup: options.warmup,
  },
  machine: {
    runtime: options.runtime,
    hostname: hostname(),
    os: `${type()} ${platform()}`,
    osRelease: release(),
    arch: arch(),
    cpuModel: cpuList[0]?.model || "unknown",
    logicalCores: cpuList.length,
    memoryGiB: round(totalmem() / 1024 ** 3),
    node: process.version,
    pnpm: await optionalCommandOutput("pnpm", ["--version"]),
    gitCommit: await optionalCommandOutput("git", ["rev-parse", "HEAD"]),
  },
  targets: Object.fromEntries(options.targets.map(target => [target, { runs: [], summary: null }])),
}

async function writeReports() {
  await Promise.all([
    writeFile(join(outputDir, "results.json"), `${JSON.stringify(report, null, 2)}\n`),
    writeFile(join(outputDir, "results.csv"), csvReport(report)),
    writeFile(join(outputDir, "report.md"), markdownReport(report)),
  ])
}

console.log(`Benchmark: ${options.label}`)
console.log(`Results: ${outputDir}`)
console.log(`Runs per target: ${options.runs}; warmup: ${options.warmup ? "yes" : "no"}`)

try {
  for (const target of options.targets) {
    if (options.warmup) {
      console.log(`\n[${target}] warmup`)
      await cleanBuildOutputs()
      const warmup = await runBuild(target, join(logsDir, `${target}-warmup.log`))
      if (warmup.exitCode !== 0) {
        fail(`${target} warmup failed. See ${join(logsDir, `${target}-warmup.log`)}`)
      }
    }

    for (let iteration = 1; iteration <= options.runs; iteration++) {
      console.log(`\n[${target}] run ${iteration}/${options.runs}`)
      await cleanBuildOutputs()
      const logPath = join(logsDir, `${target}-${String(iteration).padStart(2, "0")}.log`)
      const result = await runBuild(target, logPath)
      const run = {
        iteration,
        durationMs: round(result.durationMs),
        status: result.exitCode === 0 ? "success" : "failed",
        log: relative(outputDir, logPath),
      }
      report.targets[target].runs.push(run)
      await writeReports()

      if (result.exitCode !== 0) {
        fail(`${target} run ${iteration} failed. See ${logPath}`)
      }

      console.log(`[${target}] run ${iteration}: ${(result.durationMs / 1000).toFixed(3)} s`)
    }

    const durations = report.targets[target].runs
      .filter(run => run.status === "success")
      .map(run => run.durationMs)
    report.targets[target].summary = stats(durations)
    await writeReports()
  }

  report.status = "success"
  await writeReports()
  console.log(`\nBenchmark complete: ${join(outputDir, "report.md")}`)
}
catch (error) {
  report.status = "failed"
  report.error = error.message
  await writeReports()
  console.error(`\nBenchmark failed: ${error.message}`)
  console.error(`Partial results: ${outputDir}`)
  process.exitCode = 1
}
