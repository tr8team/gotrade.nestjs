#!/usr/bin/env bash

file="$1"

# shellcheck disable=SC2124
dev=${@:2}

set -eou pipefail

[ "$file" = '' ] && file="./config/dev.yaml"

landscape="$(yq -r '.landscape' "$file")"
platform="$(yq -r '.platform' "$file")"
service="$(yq -r '.service' "$file")"
port="$(yq -r '.port' "$file")"
fast="$(yq -r '.fast' "$file")"
startCluster="$(yq -r '.startCluster' "$file")"
mode="$(yq -r '.type' "$file")"

if [ "$fast" = 'true' ]; then
  kubectx "k3d-$landscape"
else
  if [ "$startCluster" = 'true' ]; then
    ./scripts/create-k3d-cluster.sh
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
    tilt down
  fi
}

if [ "$mode" = 'cluster' ]; then
  cleanup() {
    stop_tilt
  }
  trap cleanup EXIT
  tilt up --port "$port" --host "0.0.0.0"
else
  tilt up --port "$port" --host "0.0.0.0" &

  name="$platform-$service-dev-proxy"
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
      echo "🛑 Deleting proxy pod..."
      kubectl delete "$target"
    fi
    stop_tilt
  }
  trap cleanup EXIT
  export LANDSCAPE="$landscape"
  # shellcheck disable=SC2086
  doppler run -p "$platform-$service" -c "$landscape" -- mirrord exec --context "k3d-$landscape" --target "$target" --fs-mode local -e -n "$platform" -- $dev
fi
