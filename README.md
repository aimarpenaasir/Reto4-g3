# Reto4-g3
Proyecto Reto 4: web de F1 Bilbao desplegada en Docker Swarm sobre AWS.

## Fase 4: empaquetar y desplegar la web

El código de la web está en `app/`. Su `Dockerfile` usa PHP con Apache porque
`tratarDatos.php` procesa los formularios; así se sirven también las páginas HTML,
el CSS, JavaScript, imágenes y el PDF.

### Publicar la imagen desde WSL

Instala Docker en WSL si todavía no lo tienes y asegúrate de que el servicio de
Docker está iniciado. Desde la raíz del repositorio, inicia sesión en Docker Hub:

```bash
docker login --username TU_USUARIO_DOCKERHUB
```

Docker solicitará la contraseña o token de forma interactiva. No lo escribas en
un comando ni lo guardes en el repositorio. Publica el código actual como versión
1.0:

```bash
bash scripts/publicar-web.sh TU_USUARIO_DOCKERHUB 1.0
```

Para publicar la versión 2.0, primero realiza los cambios que distinguirán esa
versión en `app/`, y después ejecuta:

```bash
bash scripts/publicar-web.sh TU_USUARIO_DOCKERHUB 2.0
```

El script construye para `linux/amd64`, arquitectura de las instancias EC2 de este
proyecto, y publica `TU_USUARIO_DOCKERHUB/f1-bilbao` con la etiqueta indicada.
No publiques 2.0 hasta tener sus cambios; una etiqueta distinta por sí sola no
crea una versión diferente.

### Desplegar cuatro réplicas desde el manager

Desde WSL, copia el script al manager y conéctate:

```bash
scp scripts/desplegar-web.sh manager-g3:/tmp/desplegar-web.sh
ssh manager-g3
```

En el manager, inicia sesión en Docker Hub y despliega la versión 1.0:

```bash
docker login --username TU_USUARIO_DOCKERHUB
DOCKERHUB_USER=TU_USUARIO_DOCKERHUB bash /tmp/desplegar-web.sh 3 1.0
```

El script verifica que el nodo sea un manager activo y que `red-g3` sea una red
overlay. Crea `web-f1-g3` con cuatro réplicas, publicado en el puerto 80. Al
publicar una versión posterior, copia de nuevo el script si ha cambiado y ejecuta:

```bash
DOCKERHUB_USER=TU_USUARIO_DOCKERHUB bash /tmp/desplegar-web.sh 3 2.0
```

### Comprobar

En el manager:

```bash
docker service ls
docker service ps web-f1-g3
```

Espera a que las cuatro tareas estén en estado `Running`, y abre
`http://IP_PUBLICA_DE_CUALQUIER_NODO` en el navegador. El grupo de seguridad debe
permitir tráfico entrante al puerto 80.
