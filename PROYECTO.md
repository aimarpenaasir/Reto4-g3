# Informe técnico — CLOUD Reto 4

## 1. Introducción y objetivos

El objetivo del proyecto es desplegar la web del evento F1 Bilbao en AWS
utilizando Terraform y un clúster Docker Swarm. La solución debe permitir
publicar la aplicación con varias réplicas, repartir las peticiones y mantener
el servicio disponible durante operaciones de escalado, mantenimiento y fallo
de nodos.

El proyecto utiliza la región `us-east-1` y cuatro instancias EC2:

| Nodo | Rol | Tipo | Disco |
|---|---|---|---|
| `manager-g3` | Manager de Swarm | `t3.medium` | 20 GB |
| `worker1-g3` | Worker | `t3.small` | 10 GB |
| `worker2-g3` | Worker | `t3.small` | 10 GB |
| `worker3-g3` | Worker | `t3.small` | 10 GB |

La aplicación se publica como `aimar06/f1-bilbao` en las versiones `1.0` y
`2.0`. El servicio `web-f1-g3` utiliza cuatro réplicas y publica el puerto 80
mediante el routing mesh de Swarm.

> **Evidencias:** las capturas definitivas deben guardarse en
> [`evidencias/`](evidencias/). Cada una debe mostrar el hostname, fecha y
> hora, explicación de la prueba, resultado y autor. No deben aparecer
> contraseñas, tokens, credenciales ni claves privadas.

## 2. Fase 0 — Entorno colaborativo y Codespace

El repositorio privado de GitHub es el punto común de trabajo. El entorno de
desarrollo se define en
 [`.devcontainer/devcontainer.json`](.devcontainer/devcontainer.json), basado
 en Ubuntu e incorporando las features de AWS CLI y Terraform.

La configuración permite trabajar desde un Codespace como máquina de control:

```bash
aws --version
terraform version
git status --short --branch
```

Desde este entorno se gestionan Terraform, AWS y el repositorio Git. Los
archivos sensibles se excluyen mediante [`.gitignore`](.gitignore); no se
versionan las claves privadas, los estados de Terraform ni las credenciales.

**Resultado:** repositorio privado creado, entorno de Codespace definido y
herramientas de administración declaradas.

**Evidencias que deben incorporarse:**

- Captura del Codespace mostrando AWS CLI y Terraform disponibles.
- Captura de la configuración de privacidad y colaboradores del repositorio.
- Captura del historial de commits y, si existen, Pull Requests.

## 3. Fase 1 — Infraestructura con Terraform

### 3.1. Organización del código

La infraestructura se encuentra en [`terraform/`](terraform/):

- [`main.tf`](terraform/main.tf) crea un manager y tres workers mediante
  `count`.
- [`variables.tf`](terraform/variables.tf) define región, grupo, AMI, tipos de
  instancia, discos, número de workers y clave AWS.
- [`security.tf`](terraform/security.tf) define el Security Group del clúster.
- [`user_data.sh`](terraform/user_data.sh) configura cada máquina al arrancar.
- [`outputs.tf`](terraform/outputs.tf) muestra nombres, IDs e IPs públicas y
  privadas.
- [`locals.tf`](terraform/locals.tf) carga automáticamente las claves públicas
  de `terraform/keys/`.

### 3.2. Arranque de las instancias

El script `user_data.sh` realiza estas tareas:

1. Configura el hostname `manager-g3` o `workerN-g3`.
2. Establece la zona horaria `Europe/Madrid`.
3. Añade las claves públicas autorizadas al usuario `ubuntu`.
4. Deshabilita el acceso de root y la autenticación por contraseña.
5. Instala Docker y activa su servicio.

### 3.3. Red y seguridad

El Security Group permite HTTP en el puerto 80 y el puerto 8080 desde
Internet, y SSH en el puerto 22 desde el rango configurado. Entre los nodos
del mismo grupo de seguridad se permiten los puertos necesarios de Swarm:

- TCP `2377` para la gestión del clúster.
- TCP/UDP `7946` para la comunicación entre nodos.
- UDP `4789` para la red overlay.
- ICMP para las comprobaciones de conectividad.

### 3.4. Validación y resultado

Los comandos utilizados para validar la configuración son:

```bash
cd terraform
terraform init
terraform fmt -check
terraform validate
terraform plan
terraform apply
terraform output
```

La configuración pasó `terraform fmt -check` y `terraform validate`. El
resultado esperado y obtenido es una infraestructura con cuatro instancias,
un Security Group compartido y outputs con las IPs públicas y privadas.

**Evidencias que deben incorporarse:**

- `terraform validate`, `plan`, `apply` y `output`.
- Consola EC2 mostrando los cuatro nodos.
- Security Group y sus reglas.
- Logs de `user_data` o comprobaciones de hostname, zona horaria, Docker y SSH.

## 4. Fase 2 — Acceso remoto por SSH

La plantilla [`config/ssh_config.example`](config/ssh_config.example) define
alias cortos para el manager y los workers. El manager utiliza su IP pública y
los workers sus IP privadas mediante `ProxyJump`:

```text
ssh manager-g3
ssh worker1-g3
ssh worker2-g3
ssh worker3-g3
```

La configuración local debe copiarse a `~/.ssh/config`, sustituir las IPs de la
sesión actual y protegerse con:

```bash
chmod 600 ~/.ssh/config
```

Las IPs públicas de AWS pueden cambiar al detener o recrear las instancias; por
eso deben consultarse de nuevo mediante `terraform output` o la consola EC2.
Los workers se administran por sus IP privadas y el salto SSH no requiere
exponerlas a Internet.

**Resultado:** los nodos son accesibles mediante alias y los workers pueden
administrarse a través del manager. El acceso root y por contraseña quedan
deshabilitados por `user_data.sh`.

**Evidencias que deben incorporarse:**

- Conexión al manager mediante alias.
- Conexión a un worker mediante `ProxyJump`.
- Comprobación de hostname y fecha/hora en cada nodo.
- Comprobación de las restricciones de SSH sin mostrar claves privadas.

## 5. Fase 3 — Clúster Docker Swarm

El clúster se inicializa utilizando la IP privada del manager para que la
comunicación interna no dependa de las IPs públicas:

```bash
docker swarm init --advertise-addr <IP_PRIVADA_MANAGER>
docker swarm join-token worker
docker node ls
```

Los tres workers se incorporan con el comando de unión generado por el manager.
Los tokens de unión son secretos y no deben aparecer en capturas ni en el
repositorio.

La red del grupo se configura como red ingress overlay con MTU 1450. El script
de despliegue comprueba que `red-g3` sea una red ingress de tipo overlay:

```bash
docker network inspect red-g3
```

**Resultado:** el clúster quedó formado por cuatro nodos activos y la red
ingress `red-g3` se utilizó para publicar el servicio. Durante las pruebas de
alta disponibilidad se configuraron tres managers: `manager-g3`,
`worker1-g3` y `worker2-g3`.

**Evidencias que deben incorporarse:**

- `docker node ls` con los cuatro nodos `Ready`.
- Inspección de `red-g3` con `Ingress=true`, driver overlay y MTU 1450.
- Pruebas de conectividad entre nodos mediante IP privada.
- Estado del clúster con los tres managers.

## 6. Fase 4 — Publicación y despliegue de la web

La aplicación está en [`app/`](app/). El Dockerfile utiliza el argumento
`APP_VERSION` para copiar el contenido de `app/1.0/` o `app/2.0/`. Ambas
versiones comparten los recursos de la web, pero la versión 2.0 tiene una
diferenciación visual.

La publicación se realiza con
[`scripts/publicar-web.sh`](scripts/publicar-web.sh):

```bash
docker login --username aimar06
bash scripts/publicar-web.sh aimar06 1.0
bash scripts/publicar-web.sh aimar06 2.0
```

El servicio se crea o actualiza con
[`scripts/desplegar-web.sh`](scripts/desplegar-web.sh):

```bash
scp scripts/desplegar-web.sh manager-g3:/tmp/desplegar-web.sh
ssh manager-g3
DOCKERHUB_USER=aimar06 bash /tmp/desplegar-web.sh 3 1.0
DOCKERHUB_USER=aimar06 bash /tmp/desplegar-web.sh 3 2.0
```

El script comprueba que se ejecuta en un manager activo, valida la red ingress
y configura:

- cuatro réplicas;
- publicación `80:80` en modo ingress;
- reinicio automático;
- actualización `start-first`;
- paralelismo de actualización igual a uno;
- rollback automático ante fallo.

El endpoint `/estado.php` devuelve la versión y el hostname del contenedor que
respondió:

```bash
docker service ls
docker service ps web-f1-g3
curl -i http://<IP_PUBLICA_DE_UN_NODO>/estado.php
```

**Resultado:** las imágenes `1.0` y `2.0` fueron publicadas en Docker Hub, el
servicio quedó operativo con cuatro réplicas y la aplicación respondió con
`HTTP 200` desde las IPs públicas de los nodos.

**Evidencias que deben incorporarse:**

- Docker Hub con las etiquetas `1.0` y `2.0`.
- `docker service ls` mostrando `4/4`.
- `docker service ps` con las tareas en ejecución.
- Respuestas de `/estado.php` con versiones y hostnames.
- Acceso HTTP desde cada IP pública.

## 7. Fase 5 — Pruebas de orquestación

Las pruebas se realizaron manteniendo consultas HTTP periódicas y observando
las tareas del servicio `web-f1-g3`.

### E1 — Balanceo de carga

Se realizaron consultas repetidas a `/estado.php`. Las respuestas mostraron
distintos hostnames, demostrando que el routing mesh distribuye el tráfico
entre contenedores del servicio.

### E2 — Escalado

El servicio se escaló a 8, 12 y 2 réplicas y posteriormente se restauró a 4:

```bash
docker service scale web-f1-g3=8
docker service scale web-f1-g3=12
docker service scale web-f1-g3=2
docker service scale web-f1-g3=4
```

En cada etapa se comprobó la convergencia con `docker service ps` y la
continuidad de las respuestas HTTP.

### E3 — Autorreparación

Se eliminó manualmente un contenedor perteneciente al servicio. Swarm detectó
que faltaba una tarea y creó automáticamente un contenedor de reemplazo hasta
volver al número deseado de réplicas.

### E4 — Alta disponibilidad ante caída de un worker

Se detuvo `worker1-g3` desde AWS. El nodo pasó a estado no disponible, pero el
servicio continuó respondiendo mediante las tareas de los demás nodos.

### E5 — Reincorporación y reequilibrio

Se volvió a iniciar `worker1-g3`, se esperó a que regresara a estado `Ready` y
se forzó una actualización del servicio para favorecer el reequilibrio:

```bash
docker service update --force web-f1-g3
```

### E6 — Mantenimiento con `drain`

El nodo se puso temporalmente en mantenimiento:

```bash
docker node update --availability drain worker1-g3
docker node ls
docker service ps web-f1-g3
docker node update --availability active worker1-g3
```

Las tareas se reubicaron y la aplicación siguió disponible. Después el nodo
volvió a `Active`.

### E7 — Actualización y rollback

Se actualizó el servicio de la versión 1.0 a la 2.0 mientras se realizaban
consultas HTTP. La política `start-first` permitió iniciar la tarea nueva antes
de detener la anterior. Después se ejecutó el rollback y finalmente se restauró
la versión 2.0.

```bash
docker service rollback web-f1-g3
docker service ps web-f1-g3
curl -sS http://<IP_PUBLICA_DE_UN_NODO>/estado.php
```

No se observaron cortes HTTP durante la actualización ni el rollback.

### E8 — Alta disponibilidad de managers

Se promovieron dos workers:

```bash
docker node promote worker1-g3 worker2-g3
docker node ls
```

Con tres managers se mantuvo el quórum. Tras la caída del líder original,
`worker1-g3` fue elegido nuevo líder y `worker2-g3` permaneció como manager
alcanzable. La web continuó operativa. El manager original se reincorporó
posteriormente al clúster.

**Evidencias que deben incorporarse para E1–E8:**

- Captura inicial, durante la prueba y resultado final de cada ejercicio.
- Prompt con hostname, fecha y hora.
- Comentario con prueba, resultado y autor.
- Ningún token, contraseña, credencial AWS o clave privada.

## 8. Validaciones del código

Antes de entregar se comprobaron los scripts y la configuración:

```bash
bash -n scripts/publicar-web.sh scripts/desplegar-web.sh
terraform -chdir=terraform fmt -check
terraform -chdir=terraform validate
git diff --check
```

Las comprobaciones de sintaxis, formato y validación de Terraform fueron
correctas.

## 9. Seguridad y entrega

- Las claves privadas y credenciales no se incluyen en el repositorio.
- Los archivos `terraform.tfstate` y sus copias están excluidos por
  [`.gitignore`](.gitignore).
- Las claves públicas del equipo se encuentran en `terraform/keys/`.
- Los tokens de Docker Hub y de unión de Swarm deben introducirse solo de forma
  interactiva y no deben aparecer en capturas.
- Antes de entregar hay que revisar las reglas SSH y usar únicamente el rango
  autorizado por el aula o el equipo.

La documentación de gestión del equipo está en [`GESTION.md`](GESTION.md) y la
memoria individual en
[`practica-individual/README.md`](practica-individual/README.md).
