# Gestión del equipo

## Reparto de tareas

El reparto se documenta según el trabajo realizado realmente, sin atribuir
tareas no ejecutadas a otros integrantes.

| Integrante | Tareas realizadas | Evidencia |
|---|---|---|
| Iker | No realizó tareas registradas en este proyecto. | Sin commits, PRs o capturas atribuidas. |
| Aritz | No realizó tareas registradas en este proyecto. | Sin commits, PRs o capturas atribuidas. |
| Eder | No realizó tareas registradas en este proyecto. | Sin commits, PRs o capturas atribuidas. |
| Ian | No realizó tareas registradas en este proyecto. | Sin commits, PRs o capturas atribuidas. |
| Aimar | Implementación técnica, Terraform, Docker Swarm, aplicación web, pruebas de orquestación y documentación. | Commits del repositorio, código de `terraform/`, `app/`, `scripts/` y documentación. |

## Colaboración

- **Repositorio:** [Reto4-g3](https://github.com/aimarpenaasir/Reto4-g3).
- **Coordinación:** el trabajo se gestionó mediante GitHub y el repositorio
  compartido.
- **Pull requests:** no hay Pull Requests registrados en el repositorio.
- **Profesor:** debe comprobarse que el profesor está invitado al repositorio
  antes de la entrega.
- **Dificultades:** las principales dificultades fueron configurar la red
  ingress de Swarm, mantener el acceso a los workers mediante sus IP privadas y
  documentar las pruebas de fallo y recuperación.

## Reflexión

La práctica permitió comprobar el ciclo completo de infraestructura como código:
crear las instancias con Terraform, configurar los nodos, formar el clúster
Docker Swarm y desplegar una aplicación versionada. Las pruebas de escalado,
autorreparación, caída de un worker, mantenimiento, actualización y elección
de un nuevo manager ayudaron a verificar la tolerancia a fallos y la alta
disponibilidad.
