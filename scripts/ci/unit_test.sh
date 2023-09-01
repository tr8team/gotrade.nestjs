#!/usr/bin/env bash

set -eou pipefail

PATH="$(pwd)/node_modules/.bin:$PATH"
pnpm install
vitest run --config ./config/test/vitest.unit.report.config.ts --coverage || true
