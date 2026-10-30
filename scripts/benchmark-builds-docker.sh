#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="${BENCHMARK_DOCKER_IMAGE:-movie-tracker-build-benchmark}"
RESULTS_DIR="${ROOT_DIR}/benchmark-results"

mkdir -p "${RESULTS_DIR}"

# Dependency installation happens while building the image, before any measured run.
docker build \
  --file "${ROOT_DIR}/benchmark/Dockerfile" \
  --tag "${IMAGE_NAME}" \
  "${ROOT_DIR}"

BENCHMARK_STATUS=0
docker run --rm \
  --volume "${RESULTS_DIR}:/app/benchmark-results" \
  "${IMAGE_NAME}" "$@" || BENCHMARK_STATUS=$?

# Bind-mounted files are owned by root on Linux unless their owner is restored.
docker run --rm \
  --volume "${RESULTS_DIR}:/app/benchmark-results" \
  --entrypoint chown \
  "${IMAGE_NAME}" -R "$(id -u):$(id -g)" /app/benchmark-results

exit "${BENCHMARK_STATUS}"
