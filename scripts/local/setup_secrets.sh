#!/usr/bin/env bash

set -eou pipefail

echo "🔏 Setting up secrets for local development..."
doppler me &>/dev/null || doppler login

echo "⬇️ Downloading local secrets..."
doppler secrets download -p "$PLATFORM-$SERVICE" -c "local" --no-file --format env-no-quotes >./infra/root_chart/env/.env.local
echo "✅ Secrets set up for local development!"

# download local-prod secrets
echo "⬇️ Downloading local-prod secrets..."
doppler secrets download -p "$PLATFORM-$SERVICE" -c "local-prod" --no-file --format env-no-quotes >./infra/root_chart/env/.env.local-prod
echo "✅ Secrets set up for local-prod development!"

# download test secrets
echo "⬇️ Downloading test secrets..."
doppler secrets download -p "$PLATFORM-$SERVICE" -c "test" --no-file --format env-no-quotes >./infra/root_chart/env/.env.test
echo "✅ Secrets set up for test development!"
