# CLOUD Reto 4 · F1 Bilbao en AWS y Docker Swarm

Proyecto académico para desplegar una web temática de Fórmula 1 en un clúster
Docker Swarm sobre AWS. La infraestructura se define con Terraform, las
imágenes se publican en Docker Hub y el servicio web se ejecuta con cuatro
réplicas para ofrecer balanceo y tolerancia a fallos.

## Resumen

La arquitectura utiliza cuatro instancias EC2 en `us-east-1`:

- `manager-g3`: manager principal, `t3.medium` y disco de 20 GB.
- `worker1-g3`, `worker2-g3` y `worker3-g3`: workers, `t3.small` y discos de
  10 GB.

El servicio `web-f1-g3` se publica mediante el puerto HTTP `80` en todos los
nodos. La red `red-g3` es la red ingress overlay de Swarm y está configurada
con MTU 1450. La aplicación dispone de las versiones `1.0` y `2.0`; el
endpoint `/estado.php` muestra la versión y el hostname del contenedor que
responde.

## Objetivos demostrados

- Aprovisionamiento reproducible de AWS con Terraform.
- Acceso SSH mediante alias y `ProxyJump` hacia los workers.
- Formación y administración de un clúster Docker Swarm.
- Balanceo de peticiones entre réplicas.
- Escalado, autorreparación y reubicación de tareas.
- Mantenimiento `drain` de nodos.
- Actualización de la aplicación y rollback.
- Alta disponibilidad mediante varios managers.

## Estructura del repositorio

| Ruta | Contenido |
|---|---|
| [`terraform/`](terraform/) | Infraestructura AWS, Security Group, outputs, claves públicas y `user_data`. |
| [`app/`](app/) | Código de la web, Dockerfile y contenidos de las versiones `1.0` y `2.0`. |
| [`scripts/`](scripts/) | Scripts para publicar imágenes y desplegar el servicio Swarm. |
| [`.devcontainer/`](.devcontainer/) | Configuración del Codespace con AWS CLI y Terraform. |
| [`config/`](config/) | Plantilla de configuración SSH. |
| [`diagramas/`](diagramas/) | Diagrama de la arquitectura. |
| [`evidencias/`](evidencias/) | Capturas y evidencias de las pruebas. |
| [`PROYECTO.md`](PROYECTO.md) | Memoria técnica y procedimiento de las fases. |
| [`GESTION.md`](GESTION.md) | Reparto de tareas y reflexión del equipo. |
| [`practica-individual/`](practica-individual/) | Memoria de la práctica individual. |

## Requisitos

- Cuenta o laboratorio AWS activo en `us-east-1`.
- AWS CLI y Terraform.
- Docker y acceso a Docker Hub.
- Clave privada SSH correspondiente al acceso configurado.
- Cuatro instancias desplegadas y un clúster Swarm inicializado.

No guardes credenciales, tokens, claves privadas ni archivos de estado de
Terraform en el repositorio. Antes de aplicar Terraform, configura un rango
SSH restringido al aula o al equipo.

## Despliegue rápido

### 1. Crear la infraestructura

Desde la raíz del repositorio:

```bash
cd terraform
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
terraform output
```

Los outputs muestran las IP públicas y privadas de los nodos. Las IP públicas
pueden cambiar cuando las instancias se detienen y vuelven a iniciarse.

### 2. Configurar el acceso SSH

Copia [`config/ssh_config.example`](config/ssh_config.example) a
`~/.ssh/config`, sustituye las IP actuales y la ruta de tu clave privada, y
aplica los permisos adecuados:

```bash
chmod 600 ~/.ssh/config
ssh manager-g3
ssh worker1-g3
```

Los workers se acceden mediante `ProxyJump` y sus IP privadas. No copies la
clave privada al repositorio.

### 3. Publicar las imágenes

Desde la raíz del proyecto:

```bash
docker login --username aimar06
bash scripts/publicar-web.sh aimar06 1.0
bash scripts/publicar-web.sh aimar06 2.0
```

El inicio de sesión solicita las credenciales de forma interactiva.

### 4. Desplegar la web

Copia el script al manager y ejecútalo allí:

```bash
scp scripts/desplegar-web.sh manager-g3:/tmp/desplegar-web.sh
ssh manager-g3
DOCKERHUB_USER=aimar06 bash /tmp/desplegar-web.sh 3 1.0
```

Para actualizar a la versión 2.0:

```bash
DOCKERHUB_USER=aimar06 bash /tmp/desplegar-web.sh 3 2.0
```

El script comprueba que el nodo sea un manager activo, valida la red ingress y
crea o actualiza el servicio con cuatro réplicas, reinicio automático,
actualización `start-first` y rollback ante fallos.

### 5. Verificar el despliegue

Desde el manager:

```bash
docker node ls
docker service ls
docker service ps web-f1-g3
curl -sS http://127.0.0.1/estado.php
```

La web queda disponible en:

```text
http://IP_PUBLICA_DE_CUALQUIER_NODO/
http://IP_PUBLICA_DE_CUALQUIER_NODO/estado.php
```

El servicio debe mostrar `4/4` réplicas y las tareas deben aparecer en estado
`Running`.

## Documentación

La descripción detallada de la infraestructura, el acceso remoto y las pruebas
de orquestación está en [`PROYECTO.md`](PROYECTO.md). Las evidencias deben
mostrar el hostname, fecha y hora, prueba realizada, resultado y autor, sin
incluir secretos.

## Enlaces

- [Repositorio GitHub](https://github.com/aimarpenaasir/Reto4-g3)
- [Imágenes en Docker Hub](https://hub.docker.com/r/aimar06/f1-bilbao)
- [Diagrama de arquitectura](diagramas/arquitectura.md)
