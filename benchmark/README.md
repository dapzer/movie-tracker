# Build benchmark

Compare backend and frontend build times on different machines. Dependency installation is not measured. Every run starts without previous build outputs and bypasses the Turbo cache; workspace dependencies required by the selected app are included in its build.

## Local (macOS or Linux)

Use the same Git commit on both machines and install dependencies before starting:

```bash
pnpm install --frozen-lockfile
pnpm benchmark:build --label current-pc
```

On the second machine:

```bash
pnpm install --frozen-lockfile
pnpm benchmark:build --label mac
```

By default, the script performs one unmeasured warmup and three measured runs of each target. Build logs and JSON, CSV, and Markdown reports are saved in `benchmark-results/<run-id>/`.

Useful options:

```bash
# Five runs, frontend only
pnpm benchmark:build --runs 5 --targets frontend --label mac

# No warmup
pnpm benchmark:build --no-warmup --targets backend
```

## Docker

The Docker image installs all dependencies during `docker build`. The benchmark starts only when the container runs, so installation and image build time are excluded.

```bash
pnpm benchmark:build:docker --label current-pc-docker
```

Options are forwarded to the benchmark script:

```bash
pnpm benchmark:build:docker --runs 1 --no-warmup --targets backend,frontend --label current-pc-docker-smoke
```

Results are mounted back into the host's `benchmark-results/` directory. On macOS, keep the same Docker Desktop CPU and memory limits when comparing runs.

## Compare two reports

Pass either report directories or their `results.json` files. The first result is the baseline:

```bash
pnpm benchmark:compare \
  benchmark-results/<current-pc-run> \
  benchmark-results/<mac-run>
```

The comparison uses median build time. Negative change and speedup above `1.00x` mean the second machine is faster.

For a fair comparison, use the same source revision, target list, run count, warmup setting, and environment variables. Avoid other heavy workloads during the benchmark. Local results also depend on the installed Node.js version; Docker results use the Node.js version pinned in `benchmark/Dockerfile`.
