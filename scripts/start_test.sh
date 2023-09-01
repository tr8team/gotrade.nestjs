#!/usr/bin/env bash

set -eou pipefail

echo "⌛ Wait for database to be ready..."
node /app/dist/src/wait.js
echo "✅ Database is ready"

echo "🧪 Executing tests..."
vitest run --config /app/config/test/vitest.int.report.config.ts --coverage
