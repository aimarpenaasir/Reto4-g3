# Gestión del equipo

## Responsables

| Responsable | Tareas realizadas |
|---|---|
| **Aimar** | Infraestructura con Terraform, configuración de los nodos, Docker Swarm, imágenes Docker, despliegue web, pruebas de orquestación y documentación técnica. |
| **Iker, Aritz, Eder e Ian** | No existe constancia registrada de tareas realizadas en el repositorio. |

Las tareas se asignan únicamente cuando hay evidencia verificable. Los
integrantes sin actividad registrada no deben aparecer como autores de trabajos
que no hayan realizado.

## Reparto por fases

| Fase | Responsable principal | Resultado |
|---|---|---|
| Entorno colaborativo y GitHub | Aimar | Repositorio privado y entorno de desarrollo preparado. |
| Infraestructura AWS con Terraform | Aimar | Manager y tres workers definidos y desplegados. |
| Acceso SSH | Aimar | Alias SSH, claves públicas y salto mediante el manager configurados. |
| Clúster Docker Swarm | Aimar | Nodos unidos, red ingress creada y servicio desplegado. |
| Publicación y despliegue web | Aimar | Imágenes `1.0` y `2.0` publicadas y servicio activo. |
| Pruebas de orquestación | Aimar | Evidencias E1–E8 realizadas y pendientes de incorporar. |
| Documentación | Aimar | README, informe técnico y memoria individual preparados. |

## Coordinación

- Repositorio: [Reto4-g3](https://github.com/aimarpenaasir/Reto4-g3).
- Control de versiones: Git y GitHub.
- Entorno principal: GitHub Codespaces.
- Evidencias técnicas: capturas, comandos y resultados documentados.
- Invitación del profesor: pendiente de comprobar antes de la entrega.

Las contribuciones deben quedar respaldadas mediante commits o Pull Requests.
Los comentarios, capturas y revisiones deben indicar el nombre del autor.

## Pull Requests

- [PR #1 — Documentacion final](https://github.com/aimarpenaasir/Reto4-g3/pull/1):
  incorporó la memoria técnica y la organización inicial de la documentación.
- [PR #2 — Actualizacion de gestion](https://github.com/aimarpenaasir/Reto4-g3/pull/2):
  incorporó el reparto de tareas y la organización del equipo.

Los dos Pull Requests están cerrados porque fueron aceptados y fusionados
(`Merged`) en la rama `main`. Ambos mantienen la trazabilidad de los cambios
realizados en GitHub.

## Dificultades

Durante el proyecto fue necesario resolver la conexión con AWS, adaptar la
configuración de Terraform, preparar el arranque de los nodos, unirlos al
clúster y configurar correctamente la red ingress de Swarm. También fue
necesario coordinar las IP públicas cambiantes y el acceso privado de los
workers mediante el manager.

## Reflexión breve

El proyecto permitió aprender a convertir una infraestructura manual en
infraestructura como código y a administrar una aplicación distribuida.
Docker Swarm mostró su utilidad para balancear el tráfico, recuperar tareas,
reubicar contenedores y mantener el servicio disponible durante fallos y
actualizaciones.

Como mejora, sería conveniente repartir las tareas desde el inicio y registrar
el trabajo de cada integrante mediante commits, ramas y Pull Requests.
