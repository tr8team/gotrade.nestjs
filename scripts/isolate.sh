#! /bin/sh

script="$1"
after="$CI_EMULATE_AFTER"

set -eu

onExit() {
  rc="$?"
  if [ "$rc" = '0' ]; then
    echo "✅ CI Emulation completed without problems!"
  else
    echo "❌ Failed start CI emulation!"
  fi
}
trap onExit EXIT

echo "💿 Creating docker volumes..."
docker volume create nix-vol
docker volume create docker-vol
echo "✅ Volumes created!"

echo "🐳 Initializing Nix DinD container..."

container_id=$(docker run --privileged -id -v /var/run.docker.sock:/var/run/docker.sock -v nix-vol:/nix -e NIXPKGS_ALLOW_UNFREE=1 -w=/workspace ghcr.io/kirinnee/nix-dind/nix-dind:main-01c761)

echo "✅ Nix DinD container initialized!"

cleanUp() {
  rc="$?"
  echo "🧹 Clean up containers removing containers..."
  docker kill "${container_id}"
  docker rm "${container_id}"
  echo "✅ Containers removed!"
  if [ "$rc" = '0' ]; then
    echo "✅ CI Emulation completed without problems!"
  else
    echo "❌ Failed run CI emulation!"
  fi
}
trap cleanUp EXIT

echo "📝 Copying files into container..."
docker cp -a . "$container_id:/data"
docker exec "${container_id}" chown -R root /data
echo "✅ Files copied into container!"

echo "🗳 Commit all files within container..."
docker exec "${container_id}" /data/scripts/emulate-commit.sh >/dev/null
echo "✅ Files committed!"

echo "📜️ Emulate git clone..."
docker exec "${container_id}" git clone /data /workspace >/dev/null
echo "✅ Git clone emulated!"

if [ "${script}" = '' ]; then
  echo "🚪 Entering container..."
  (docker exec -ti "${container_id}" sh) || true
elif [ "${script}" = ':nix-shell:' ]; then
  echo "🚪 Entering container..."
  (docker exec -ti "${container_id}" nix-shell /workspace/nix/shells.nix -A ci --pure) || true
else
  echo "🏃‍ Running script '${script}'..."
  docker exec -t "${container_id}" nix-shell /workspace/nix/shells.nix -A ci --pure --run "scripts/ci/${script}.sh"
  if [ "${after}" = 'enter' ]; then
    (docker exec -ti "${container_id}" sh) || true
  fi
fi
