#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $# -ne 2 ]]; then
  printf 'Uso: %s <usuario-docker-hub> <version: 1.0 o 2.0>\n' "$0" >&2
  exit 2
fi

dockerhub_user="$1"
version="$2"
if [[ ! "$dockerhub_user" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
  printf 'Error: el usuario de Docker Hub no tiene un formato válido.\n' >&2
  exit 2
fi
if [[ ! "$version" =~ ^(1\.0|2\.0)$ ]]; then
  printf 'Error: la versión debe ser 1.0 o 2.0.\n' >&2
  exit 2
fi
command -v docker >/dev/null || {
  printf 'Error: Docker no está instalado o no está en PATH.\n' >&2
  exit 1
}

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
image="docker.io/${dockerhub_user}/f1-bilbao:${version}"

docker build \
  --platform linux/amd64 \
  --build-arg "APP_VERSION=$version" \
  --tag "$image" \
  --file "$repo_root/app/Dockerfile" \
  "$repo_root/app"
docker push "$image"

printf 'Imagen publicada: %s\n' "$image"
