#!/usr/bin/env bash

set -eou pipefail
pnpm i
PATH="$(pwd)/node_modules/.bin:$PATH"
pre-commit run --all
