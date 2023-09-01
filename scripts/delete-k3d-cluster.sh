#!/usr/bin/env bash

dev_config="$1"

set -eou pipefail

[ "$dev_config" = '' ] && dev_config="./config/dev.yaml"

# check if dev config exists
if [ ! -f "$dev_config" ]; then
  echo "❌ Dev config '$dev_config' does not exist!"
  exit 1
fi

input="$(yq '.landscape' "$dev_config")"

echo "🛠️ Attempting to delete cluster '$input'..."

# obtain existing cluster
current="$(k3d cluster ls -o json | jq -r --arg input "${input}" '.[] | select(.name == $input) | .name')"
if [ "$current" = "$input" ]; then
  echo "🗑️ Cluster found! Deleting cluster..."
  k3d cluster delete "$input"
  echo "✅ Cluster deleted!"
else
  echo "⚠️ Cluster does not exist!"
fi
echo "🧹 Cleaning up kubeconfig files..."
mkdir -p "$HOME/.kube/configs"
mkdir -p "$HOME/.kube/k3dconfigs"
rm "$HOME/.kube/k3dconfigs/k3d-$input" || true
KUBECONFIG=$(cd ~/.kube/configs && find "$(pwd)"/* | awk 'ORS=":"')$(cd ~/.kube/k3dconfigs && find "$(pwd)"/* | awk 'ORS=":"') kubectl config view --flatten >~/.kube/config
chmod 600 ~/.kube/config
echo "✅ Config is cleared!"
