#!/usr/bin/env bash
set -Eeuo pipefail

# Recibir el grupo y la versión que se desplegará en el servicio Swarm.
if [[ $# -ne 2 ]]; then
  printf 'Uso: DOCKERHUB_USER=<usuario> %s <grupo> <version: 1.0 o 2.0>\n' "$0" >&2
  exit 2
fi

group="$1"
version="$2"
dockerhub_user="${DOCKERHUB_USER:-}"

# Validar los parámetros antes de ejecutar cambios en el clúster.
if [[ ! "$group" =~ ^[0-9]+$ ]]; then
  printf 'Error: el grupo debe ser numérico.\n' >&2
  exit 2
fi
if [[ ! "$version" =~ ^(1\.0|2\.0)$ ]]; then
  printf 'Error: la versión debe ser 1.0 o 2.0.\n' >&2
  exit 2
fi
if [[ ! "$dockerhub_user" =~ ^[a-z0-9][a-z0-9_-]*$ ]]; then
  printf 'Error: define DOCKERHUB_USER con tu usuario de Docker Hub.\n' >&2
  exit 2
fi
command -v docker >/dev/null || {
  printf 'Error: Docker no está instalado o no está en PATH.\n' >&2
  exit 1
}

# El despliegue solo se permite desde un manager activo.
swarm_status="$(docker info --format '{{.Swarm.LocalNodeState}} {{.Swarm.ControlAvailable}}')"
if [[ "$swarm_status" != "active true" ]]; then
  printf 'Error: este host no es un manager activo de Docker Swarm (estado: %s).\n' "$swarm_status" >&2
  exit 1
fi

network="red-g${group}"
service="web-f1-g${group}"

# Comprobar que la red del grupo es la red ingress overlay de Swarm.
network_type="$(docker network inspect --format '{{.Ingress}} {{.Scope}}/{{.Driver}}' "$network")"
if [[ "$network_type" != "true swarm/overlay" ]]; then
  printf 'Error: la red %s debe ser la red ingress overlay de Swarm (detectada: %s).\n' "$network" "$network_type" >&2
  exit 1
fi

image="docker.io/${dockerhub_user}/f1-bilbao:${version}"

# Actualizar el servicio existente o crearlo con cuatro réplicas.
if docker service ls --format '{{.Name}}' | grep -Fxq "$service"; then
  docker service update \
    --image "$image" \
    --replicas 4 \
    --with-registry-auth \
    --restart-condition any \
    --restart-delay 5s \
    --update-order start-first \
    --update-parallelism 1 \
    --update-delay 5s \
    --update-monitor 30s \
    --update-failure-action rollback \
    --rollback-order start-first \
    --rollback-parallelism 1 \
    "$service"
else
  docker service create \
    --name "$service" \
    --replicas 4 \
    --publish published=80,target=80,mode=ingress \
    --with-registry-auth \
    --restart-condition any \
    --restart-delay 5s \
    --update-order start-first \
    --update-parallelism 1 \
    --update-delay 5s \
    --update-monitor 30s \
    --update-failure-action rollback \
    --rollback-order start-first \
    --rollback-parallelism 1 \
    "$image"
fi

# Mostrar el estado final para comprobar la convergencia del despliegue.
printf '\nEstado del servicio:\n'
docker service ls --filter "name=${service}"
docker service ps "$service"
