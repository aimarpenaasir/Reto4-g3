# Reto4-g3
Proyecto Reto 4: web de F1 Bilbao desplegada en Docker Swarm sobre AWS.

## Fase 4: empaquetar y desplegar la web

El código común de la web está en `app/`; los inicios específicos de cada versión
están en `app/1.0/` y `app/2.0/`. Su `Dockerfile` usa PHP con Apache porque
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

La versión 2.0 ya incluye una nota visible sobre la consulta de nodos del clúster.
Para publicarla:

```bash
bash scripts/publicar-web.sh TU_USUARIO_DOCKERHUB 2.0
```

El script construye para `linux/amd64`, arquitectura de las instancias EC2 de este
proyecto. El Dockerfile selecciona `app/<version>/index.html`, comparte el resto
de recursos y establece la misma versión en la imagen; después publica
`TU_USUARIO_DOCKERHUB/f1-bilbao` con la etiqueta indicada. Ambas páginas muestran
la versión y el hostname del contenedor que responde. En 2.0, ese dato se
actualiza cada dos segundos para observar el balanceo.

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

El script verifica que el nodo sea un manager activo y que `red-g3` sea la red
ingress overlay de Swarm. Al publicar el puerto 80 en modo ingress, Swarm conecta
el servicio a esa red automáticamente; no debe añadirse con `--network`. Crea
`web-f1-g3` con cuatro réplicas, política de reinicio automático y actualizaciones
`start-first` con rollback automático ante fallos. Al publicar una versión
posterior, copia de nuevo el script si ha cambiado y ejecuta:

```bash
DOCKERHUB_USER=TU_USUARIO_DOCKERHUB bash /tmp/desplegar-web.sh 3 2.0
```

### Comprobar

En el manager:

```bash
docker service ls
docker service ps web-f1-g3
curl -sS http://IP_PUBLICA_DE_CUALQUIER_NODO/estado.php
```

Espera a que las cuatro tareas estén en estado `Running`, y abre
`http://IP_PUBLICA_DE_CUALQUIER_NODO` en el navegador. El grupo de seguridad debe
permitir tráfico entrante al puerto 80. La respuesta JSON de `estado.php` permite
comprobar la versión y el hostname que atendieron esa solicitud.
