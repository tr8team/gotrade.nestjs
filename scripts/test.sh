#!/usr/bin/env bash

file="$1"

# shellcheck disable=SC2124
test=${@:2}

set -eou pipefail

[ "$file" = '' ] && file="./config/test.yaml"

landscape="$(yq -r '.landscape' "$file")"
platform="$(yq -r '.platform' "$file")"
service="$(yq -r '.service' "$file")"
fast="$(yq -r '.fast' "$file")"
startCluster="$(yq -r '.startCluster' "$file")"
mode="$(yq -r '.type' "$file")"
port="$(yq -r '.port' "$file")"

if [ "$fast" = 'true' ]; then
  kubectx "k3d-$landscape"
else
  if [ "$startCluster" = 'true' ]; then
    ./scripts/create-k3d-cluster.sh "$file"
    echo "🔃 Switching Context"
    kubectx "k3d-$landscape"
    echo "✅ Context switched"
  else
    kubectx
  fi
fi

if [ "$fast" = 'false' ]; then
  echo "🛠 Creating namespace '$platform'..."
  kubectl create ns "$platform" || true
  echo "✅ Namespace created"
fi

echo "🔃 Switching Namespace"
kubens "$platform"
echo "✅ Namespace switched"

# tilt down
stop_tilt() {
  if [ "$fast" = 'false' ]; then
    echo "🛑 Stopping tilt..."
    tilt down -- --config config/test.yaml --action test
  fi
}

if [ "$mode" = 'cluster' ]; then
  # complex
  cleanup() {
    stop_tilt
  }
  trap cleanup EXIT
  tilt up --port "$port" -- --config "$file" --action test --command "$test"
else
  export LANDSCAPE="$landscape"
  tilt up --port "$port" -- --config "$file" --action test &

  name="$platform-$service-test-proxy"
  target="pod/$name"
  kubectl apply -f - <<EOF
  apiVersion: v1
  kind: Pod
  metadata:
    name: $name
  spec:
    containers:
    - name: app
      image: nginx:latest
EOF
  echo "⌛ Waiting for pod to be ready..."
  kubectl wait --for=condition=ready "$target" --timeout="2m"
  echo "✅ Pod is ready"
  cleanup() {
    if [ "$fast" = 'false' ]; then
      kubectl delete "$target"
    fi
    stop_tilt
  }
  trap cleanup EXIT
  doppler run -p "$platform-$service" -c "$landscape" -- mirrord exec --context "k3d-$landscape" --target "$target" --fs-mode local -e -n "$platform" -- ts-node ./src/wait.ts
  # shellcheck disable=SC2086
  doppler run -p "$platform-$service" -c "$landscape" -- mirrord exec --context "k3d-$landscape" --target "$target" --fs-mode local -e -n "$platform" -- $test
fi
