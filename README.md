# CLOUD Reto 4 — F1 Bilbao en Docker Swarm

Proyecto académico para desplegar una web del evento F1 Bilbao en cuatro
instancias EC2 de AWS, aprovisionadas con Terraform y organizadas como un
clúster Docker Swarm. La arquitectura consta de un manager y tres workers; el
servicio web se publica por HTTP en el puerto 80 y usa cuatro réplicas.

## Fases del proyecto

- **Fase 0 — Entorno colaborativo:** GitHub, Codespace y herramientas de
  Terraform/AWS CLI en `.devcontainer/`.
- **Fase 1 — Infraestructura:** configuración de EC2, reglas de red, claves
  públicas, arranque y outputs en `terraform/`.
- **Fase 2 — Acceso remoto:** SSH a los nodos y salto a workers desde el manager.
- **Fase 3 — Docker Swarm:** manager, workers y red ingress overlay del grupo.
- **Fase 4 — Web:** imágenes versionadas, publicación en Docker Hub y servicio de
  cuatro réplicas.
- **Fase 5 — Pruebas:** balanceo, escalado, recuperación, mantenimiento,
  actualizaciones y alta disponibilidad.

## Estructura principal

- `terraform/`: infraestructura AWS como código.
- `app/`: web, Dockerfile y páginas específicas de las versiones `1.0` y `2.0`.
- `scripts/`: publicación de imágenes y despliegue del servicio Swarm.
- `.devcontainer/`: definición del entorno de Codespaces.
- `config/`: plantilla de configuración SSH.
- `diagramas/`: diagrama de arquitectura.
- `evidencias/`: capturas comentadas de las pruebas.
- `PROYECTO.md`: procedimiento técnico y evidencias pendientes de adjuntar.
- `GESTION.md`: plantilla de reparto de tareas del equipo.
- `practica-individual/`: plantilla para documentar la práctica individual.


## Despliegue rápido de la web

Requisitos: Docker disponible en WSL, acceso a Docker Hub, clúster Swarm activo
con manager `manager-g3` y red ingress `red-g3`. Los comandos siguientes usan el
grupo 3; adapta el número y los nombres si el grupo cambia.

1. Desde la raíz del repositorio, inicia sesión y publica la imagen que quieras:

   ```bash
   docker login --username aimar06
   bash scripts/publicar-web.sh aimar06 1.0
   # Para publicar la versión 2.0:
   bash scripts/publicar-web.sh aimar06 2.0
   ```

   Docker solicita la contraseña o el token de forma interactiva. No incluyas
   credenciales en comandos, archivos del repositorio ni capturas.

2. Copia el script al manager y conéctate:

   ```bash
   scp scripts/desplegar-web.sh manager-g3:/tmp/desplegar-web.sh
   ssh manager-g3
   ```

3. En el manager, despliega o actualiza el servicio:

   ```bash
   docker login --username aimar06
   DOCKERHUB_USER=aimar06 bash /tmp/desplegar-web.sh 3 1.0
   # Para actualizar a 2.0:
   DOCKERHUB_USER=aimar06 bash /tmp/desplegar-web.sh 3 2.0
   ```

4. Comprueba las réplicas y la versión servida:

   ```bash
   docker service ls
   docker service ps web-f1-g3
   curl -sS http://IP_PUBLICA_DE_UN_NODO/estado.php
   ```

   Espera a que el servicio muestre `4/4` réplicas y las tareas estén en estado
   `Running`. La página está disponible en `http://IP_PUBLICA_DE_CUALQUIER_NODO`.

## Enlaces

- [Repositorio GitHub](https://github.com/aimarpenaasir/Reto4-g3)
- [Imágenes F1 Bilbao en Docker Hub](https://hub.docker.com/r/aimar06/f1-bilbao)
