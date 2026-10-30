# Build benchmark: current-pc-docker

- Status: success
- Runtime: docker
- OS: Linux linux 6.18.59-1-lts (x64)
- CPU: AMD Ryzen 9 9950X3D 16-Core Processor, 32 logical cores
- Memory: 91.873 GiB
- Node.js: v24.13.0
- pnpm: 10.29.1
- Git commit: unknown
- Measured runs per target: 3
- Warmup: yes

Only build time is measured. Dependency installation and output cleanup are excluded.
Turbo cache is bypassed and build outputs are removed before every run.

| Target | Runs (s) | Min (s) | Median (s) | Mean (s) | Max (s) |
| --- | --- | ---: | ---: | ---: | ---: |
| backend | 11.069, 11.086, 11.033 | 11.033 | 11.069 | 11.063 | 11.086 |
| frontend | 26.977, 27.054, 26.863 | 26.863 | 26.977 | 26.965 | 27.054 |
