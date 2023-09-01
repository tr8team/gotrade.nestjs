#!/usr/bin/env bash

# check for necessary env vars
[ "${DOMAIN}" = '' ] && echo "❌ 'DOMAIN' env var not set" && exit 1
[ "${GITHUB_REPO_REF}" = '' ] && echo "❌ 'GITHUB_REPO_REF' env var not set" && exit 1
[ "${GITHUB_SHA}" = '' ] && echo "❌ 'GITHUB_SHA' env var not set" && exit 1
[ "${GITHUB_BRANCH}" = '' ] && echo "❌ 'GITHUB_BRANCH' env var not set" && exit 1

[ "${CI_DOCKER_IMAGE}" = '' ] && echo "❌ 'CI_DOCKER_IMAGE' env var not set" && exit 1
[ "${CI_DOCKER_CONTEXT}" = '' ] && echo "❌ 'CI_DOCKER_CONTEXT' env var not set" && exit 1
[ "${CI_DOCKERFILE}" = '' ] && echo "❌ 'CI_DOCKERFILE' env var not set" && exit 1
[ "${CI_DOCKER_PLATFORM}" = '' ] && echo "❌ 'CI_DOCKER_PLATFORM' env var not set" && exit 1

[ "${DOCKER_PASSWORD}" = '' ] && echo "❌ 'DOCKER_PASSWORD' env var not set" && exit 1
[ "${DOCKER_USER}" = '' ] && echo "❌ 'DOCKER_USER' env var not set" && exit 1

[ "${S3_KEY_ID}" = '' ] && echo "❌ 'S3_KEY_ID' env var not set" && exit 1
[ "${S3_KEY_SECRET}" = '' ] && echo "❌ 'S3_KEY_SECRET' env var not set" && exit 1
[ "${S3_BUCKET}" = '' ] && echo "❌ 'S3_BUCKET' env var not set" && exit 1
[ "${S3_REGION}" = '' ] && echo "❌ 'S3_REGION' env var not set" && exit 1
[ "${S3_URL}" = '' ] && echo "❌ 'S3_URL' env var not set" && exit 1

[ "${LATEST_BRANCH}" = '' ] && echo "❌ 'LATEST_BRANCH' env var not set" && exit 1

set -euo pipefail

onExit() {
  rc="$?"
  if [ "$rc" = '0' ]; then
    echo "✅ Successfully built and run images"
  else
    echo "❌ Failed to run Docker image"
  fi
}

trap onExit EXIT

# Login to GitHub Registry
echo "🔐 Logging into docker registry..."
echo "${DOCKER_PASSWORD}" | docker login "${DOMAIN}" -u "${DOCKER_USER}" --password-stdin
echo "✅ Successfully logged into docker registry!"

echo "📝 Generating Image tags..."

# Obtain image
# shellcheck disable=SC2001
IMAGE_ID="${DOMAIN}/${GITHUB_REPO_REF}/$(echo "${CI_DOCKER_IMAGE}" | sed 's/[._-]*$//')"
IMAGE_ID=$(echo "${IMAGE_ID}" | tr '[:upper:]' '[:lower:]') # convert to lower case

# obtaining the version
SHA="$(echo "${GITHUB_SHA}" | head -c 6)"
# shellcheck disable=SC2001
BRANCH="$(echo "${GITHUB_BRANCH}" | sed 's/[._-]*$//')"
IMAGE_VERSION="${SHA}-${BRANCH}"

# Generate image references
COMMIT_IMAGE_REF="${IMAGE_ID}:${IMAGE_VERSION}"
BRANCH_IMAGE_REF="${IMAGE_ID}:${BRANCH}"
LATEST_IMAGE_REF="${IMAGE_ID}:latest"

# Generate cache references
CACHE_COMMIT="${IMAGE_ID}/${SHA}-${BRANCH}"
CACHE_BRANCH="${IMAGE_ID}/${BRANCH}"
CACHE_LATEST="${IMAGE_ID}/latest"

echo "  ✅ Commit Image Ref: ${COMMIT_IMAGE_REF}"
echo "  ✅ Branch Image Ref: ${BRANCH_IMAGE_REF}"
echo "  ✅ Latest Image Ref: ${LATEST_IMAGE_REF}"
echo ""
echo "  ✅ Commit Cache: ${CACHE_COMMIT}"
echo "  ✅ Branch Cache: ${CACHE_BRANCH}"
echo "  ✅ Latest Cache: ${CACHE_LATEST}"

# build image
export AWS_ACCESS_KEY_ID="${S3_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${S3_KEY_SECRET}"

echo "🔨 Building Dockerfile..."
args=""
if [ "$BRANCH" = "$LATEST_BRANCH" ]; then
  echo "🔎 Detected branch is '${LATEST_BRANCH}', push 'latest' tag!"
  args="-t ${LATEST_IMAGE_REF}"
fi

# shellcheck disable=SC2086
docker buildx build \
  "${CI_DOCKER_CONTEXT}" \
  -f "${CI_DOCKERFILE}" \
  --platform=${CI_DOCKER_PLATFORM} \
  --push \
  --cache-from "type=s3,endpoint_url=${S3_URL},region=${S3_REGION},bucket=${S3_BUCKET},name=${CACHE_COMMIT}" \
  --cache-from "type=s3,endpoint_url=${S3_URL},region=${S3_REGION},bucket=${S3_BUCKET},name=${CACHE_BRANCH}" \
  --cache-from "type=s3,endpoint_url=${S3_URL},region=${S3_REGION},bucket=${S3_BUCKET},name=${CACHE_LATEST}" \
  --cache-to "type=s3,endpoint_url=${S3_URL},region=${S3_REGION},bucket=${S3_BUCKET},ref=${CACHE_COMMIT};${CACHE_BRANCH};${CACHE_LATEST},mode=max" \
  -t "${COMMIT_IMAGE_REF}" $args \
  -t "${BRANCH_IMAGE_REF}"
echo "✅ Pushed branch image!"
