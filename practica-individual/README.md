# Práctica individual — Aimar

## Datos de la práctica

- **Alumno:** Aimar Peña
- **Proyecto:** CLOUD Reto 4 — Web F1 Bilbao en AWS con Terraform y Docker
  Swarm
- **Repositorio:** [Reto4-g3](https://github.com/aimarpenaasir/Reto4-g3)
- **Región AWS:** `us-east-1`
- **Objetivo:** Aprovisionar una infraestructura reproducible, desplegar una
  web versionada y comprobar el funcionamiento de Docker Swarm ante cambios de
  carga y fallos de nodos.

## Trabajo realizado

La práctica individual consistió en preparar y validar los componentes
necesarios para desplegar la aplicación:

1. Configuración de un entorno de trabajo con AWS CLI y Terraform mediante
   `.devcontainer/devcontainer.json`.
2. Definición de la infraestructura AWS en `terraform/`, con un manager y tres
   workers creados mediante `count`.
3. Configuración de los nodos mediante `user_data.sh`: hostname, zona horaria,
   claves públicas, restricciones de SSH e instalación de Docker.
4. Configuración de acceso SSH mediante alias y `ProxyJump` para acceder a los
   workers a través del manager.
5. Construcción de las imágenes Docker de la aplicación en las versiones `1.0`
   y `2.0`, y publicación en Docker Hub.
6. Inicialización del clúster Swarm y despliegue del servicio
   `web-f1-g3` con cuatro réplicas.
7. Validación del balanceo mediante `estado.php`, que muestra la versión y el
   hostname del contenedor que atiende cada petición.
8. Ejecución de las pruebas de orquestación: escalado, autorreparación, caída y
   reincorporación de un worker, mantenimiento `drain`, actualización,
   rollback y elección de un nuevo manager líder.

## Comandos principales utilizados

Validación de Terraform:

```bash
terraform -chdir=terraform fmt -check
terraform -chdir=terraform init
terraform -chdir=terraform validate
terraform -chdir=terraform plan
terraform -chdir=terraform output
```

Publicación de las imágenes:

```bash
docker login --username aimar06
bash scripts/publicar-web.sh aimar06 1.0
bash scripts/publicar-web.sh aimar06 2.0
```

Comprobación del clúster y del servicio:

```bash
docker node ls
docker service ls
docker service ps web-f1-g3
curl -sS http://<IP_PUBLICA_DE_UN_NODO>/estado.php
```

## Resultado

La infraestructura se validó correctamente y el clúster quedó formado por
cuatro nodos. La aplicación respondió mediante las IP públicas de los nodos,
con cuatro réplicas activas y versiones `1.0` y `2.0` disponibles.

Las pruebas de Swarm demostraron que:

- el tráfico se reparte entre distintos contenedores;
- el servicio puede escalar y volver a reducirse;
- Swarm reemplaza automáticamente una tarea eliminada;
- la web continúa respondiendo cuando un worker deja de estar disponible;
- las tareas se reubican cuando el worker vuelve o entra en `drain`;
- la actualización y el rollback mantienen el servicio operativo;
- otro manager puede asumir el liderazgo si cae el líder original.

## Conclusión

La práctica permitió comprobar el ciclo completo de infraestructura como código,
acceso remoto, despliegue de una aplicación y administración de un clúster
Docker Swarm tolerante a fallos. Las credenciales, tokens y claves privadas no
se incluyen en el repositorio.

## Evidencias

Las capturas de las pruebas deben guardarse en [`../evidencias/`](../evidencias/)
con el hostname del nodo, fecha y hora, descripción de la prueba, resultado y
autor. No se deben incluir contraseñas, tokens, credenciales de AWS ni claves
privadas.
