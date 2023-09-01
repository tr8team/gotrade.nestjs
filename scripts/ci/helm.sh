#!/usr/bin/env bash

[ "${DOMAIN}" = '' ] && echo "❌ 'DOMAIN' env var not set" && exit 1

[ "${GITHUB_SHA}" = '' ] && echo "❌ 'GITHUB_SHA' env var not set" && exit 1
[ "${GITHUB_BRANCH}" = '' ] && echo "❌ 'GITHUB_BRANCH' env var not set" && exit 1

[ "${HARBOR_USER}" = '' ] && echo "❌ 'HARBOR_USER' env var not set" && exit 1
[ "${HARBOR_PASSWORD}" = '' ] && echo "❌ 'HARBOR_PASSWORD' env var not set" && exit 1
[ "${HARBOR_CHART_REF}" = '' ] && echo "❌ 'HARBOR_CHART_REF' env var not set" && exit 1

HELM_VERSION=$1

set -euo pipefail

SHA="$(echo "${GITHUB_SHA}" | head -c 6)"
# shellcheck disable=SC2001
BRANCH="$(echo "${GITHUB_BRANCH}" | sed 's/[._-]*$//')"
IMAGE_VERSION="${SHA}-${BRANCH}"

[ "${HELM_VERSION}" = '' ] && HELM_VERSION="v0.0.0-${IMAGE_VERSION}"

echo "📝 Generating Image tags..."
echo "📝 Helm version: ${HELM_VERSION}"
echo "📝 Image version: ${IMAGE_VERSION}"

echo "📝 Updating Chart.yaml..."

find . -name "Chart.yaml" | while read -r file; do
  echo "📝 Updating AppVersion: $file"
  yq eval ".appVersion = \"${IMAGE_VERSION}\"" "$file" >"${file}.tmp"
  mv "${file}.tmp" "$file"
  echo "✅ Updated AppVersion: $file"
done

echo "✅ Updated Chart.yaml"

# change directory
echo "📂 Changing directory to ./infra/root_chart"
cd ./infra/root_chart || exit

onExit() {
  rc="$?"
  rm -rf ./uploads
  if [ "$rc" = '0' ]; then
    echo "✅ Successfully published helm chart"
  else
    echo "❌ Failed to publish helm chart"
  fi
}
trap onExit EXIT

# install CM plugin
echo "🔌 Installing helm plugin..."
helm plugin install https://github.com/chartmuseum/helm-push || true

# packaging helm chart
echo "📦 Packaging helm chart..."
helm dependency update
helm package . -u --version "${HELM_VERSION}" --app-version "${IMAGE_VERSION}" -d ./uploads

echo "📤 Pushing helm chart..."
for filename in ./uploads/*.tgz; do
  helm cm-push --username="${HARBOR_USER}" --password="${HARBOR_PASSWORD}" "$filename" "https://${DOMAIN}/${HARBOR_CHART_REF}"
done
