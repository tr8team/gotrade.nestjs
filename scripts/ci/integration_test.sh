#!/usr/bin/env bash

[ "${DOPPLER_TOKEN}" = '' ] && echo "❌ 'DOPPLER_TOKEN' env var not set" && exit 1

set -eou pipefail

echo "🧪 Executing tests..."
./scripts/ci.sh
echo "✅ Integration tests completed"
