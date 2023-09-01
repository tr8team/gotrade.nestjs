#!/usr/bin/env bash

file="$1"

set -eou pipefail

[ "$file" = '' ] && file="./config/ci.yaml"

landscape="$(yq -r '.landscape' "$file")"
platform="$(yq -r '.platform' "$file")"
service="$(yq -r '.service' "$file")"

./scripts/create-k3d-cluster.sh "$file"
context="k3d-$landscape"

echo "🛠 Creating namespace '$platform'..."
kubectl --context "$context" create ns "$platform" || true
echo "✅ Namespace created"

cleanup() {
  echo "🧹 Cleaning up..."
  tilt down --context "$context" -- --config "$file" --action test || true
  kubectl --context "$context" --namespace "$platform" delete --force -f ./infra/ci/pod.yaml || true
  kubectl --context "$context" --namespace "$platform" delete -f ./infra/ci/pvc.yaml || true
  kubectl --context "$context" --namespace "$platform" delete -f ./infra/ci/pv.yaml || true
  rm ./infra/root_chart/env/.env.ci || true
}
cleanup

trap cleanup EXIT

echo "🔑 Downloading secrets..."
project_doppler_token="$(doppler secrets get "${platform^^}_${service^^}_DOPPLER_TOKEN" -p doppler-secrets -c ci --plain)"
doppler secrets download --token="${project_doppler_token}" -p "$platform-$service" -c "ci" --no-file --format env-no-quotes >./infra/root_chart/env/.env.ci
echo "✅ Secrets downloaded"

echo "📦 Copying config..."
./scripts/config-sync.sh
echo "✅ Config copied"

echo "🚀 Starting CI..."
# create PV to store test results
kubectl --context "$context" --namespace "$platform" apply -f ./infra/ci/pv.yaml
kubectl --context "$context" --namespace "$platform" apply -f ./infra/ci/pvc.yaml
tilt ci --context "$context" --port 0 -- --config "$file" --action test
kubectl --context "$context" --namespace "$platform" apply -f ./infra/ci/pod.yaml
echo "⌛ Waiting for pod to be ready..."
kubectl --context "$context" --namespace "$platform" wait --for=condition=ready pod/test-result-extractor --timeout="2m"
echo "✅ Pod is ready"
echo "📦 Copying test results..."
kubectl --context "$context" cp gotrade/test-result-extractor:/app/test-results "$(pwd)/test-results"
echo "✅ Test results copied"
