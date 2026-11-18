# Evidencias

Guardar aquí las capturas originales del proyecto, organizadas por fases.
Cada captura debe permitir identificar el prompt/hostname y la fecha/hora, e ir
acompañada de un comentario con la prueba, el resultado y el autor. No incluir
tokens, contraseñas, credenciales AWS ni claves privadas.

Nombres sugeridos:

```text
fase-0-codespace-<autor>-<fecha>.png
fase-1-terraform-<prueba>-<autor>-<fecha>.png
fase-2-ssh-<prueba>-<autor>-<fecha>.png
fase-3-swarm-<prueba>-<autor>-<fecha>.png
fase-4-web-<version>-<nodo>-<autor>-<fecha>.png
fase-5-orquestacion-<prueba>-<momento>-<autor>-<fecha>.png
```



FASE 0
creacion del repositorio
![alt text](image.png)

codespace creado con aws cli y terraform
![alt text](image-1.png)


trabajo colaborativo
![alt text](image-2.png)

FASE 1
creacion de la variables
![alt text](image-3.png)

script de arranque
![alt text](image-4.png)

Output:
Esto es lo que sale después de hacer terraform init (prepara la carpreta), terraform validate (revisa los .tf), terraform plan (muestra lo que va crear), terraform apply (crea los recursos), terraform output (muestra los output).
![alt text](image-5.png)

Seguridad (Security Group único):
![alt text](image-6.png)

EC2
![alt text](image-7.png)

FASE 2
ssh con alias:
manager
![alt text](image-8.png)
workers
![alt text](image-9.png)
![alt text](image-10.png)
![alt text](image-11.png)

FASE 3
docker node ls:
![alt text](image-12.png)

red:
![alt text](image-13.png)
MTU 1450
![alt text](image-14.png)
Ingress
![alt text](image-15.png)

FASE 4
Imagenes docker hub
![alt text](image-16.png)

Respuesta de estado.php
![alt text](image-17.png)

Acceso HTTP desde cada IP pública.
Manager
![alt text](image-18.png)
Worker 1
![alt text](image-19.png)
Worker 2
![alt text](image-20.png)
Worker 3
![alt text](image-21.png)

FASE 5
Balanceo de carga.
![alt text](image-22.png)

Escalado
A 8
![alt text](image-23.png)
A 12
![alt text](image-24.png)
A 2
![alt text](image-25.png)

Autorreparación (eliminar contenedor)
Antes
![alt text](image-26.png)
Eliminacion
![alt text](image-27.png)
Después
![alt text](image-28.png)

Alta disponibilidad (caída worker)
Antes
![alt text](image-29.png)
Con la caída de un worker, sigue dando 200 OK
![alt text](image-30.png)


Reincorporación y reequilibrio; reinicio lab
![alt text](image-31.png)


Mantenimiento (modo drain)
Se pone el worker1 en drain
![alt text](image-32.png)
Convergido
![alt text](image-33.png)
Una vez puesto en drain lo volvemos a poner en running .
![alt text](image-34.png)


Actualización (1.0 a 2.0) sin corte y rollback
Cambio a versión 1.0. De ejercicios anteriores estaba en 2.0 y por eso  la pasamos a 1.0.
![alt text](image-35.png)
Una vez cambiada a 1.0, ejecutamos un bucle para ver que está en versión 1.0 y cuando en una segunda terminal ejecutamos el comando para cambiar a versión 2.0 vemos que se cambia de versión sin cortes con el mismo bucle.
![alt text](image-36.png)
Este es el comando que ejecutamos en otra terminal para cambiar de versión.
![alt text](image-37.png)
Luego usamos el rollback para volver a la versión 1.0.
![alt text](image-38.png)


Alta disp. managers (nuevo líder), promover 2 workers a manager
![alt text](image-39.png)
Ver los roles
![alt text](image-40.png)
Tras apagar el líder original, Swarm eligió a worker1-g3 como nuevo líder.
![alt text](image-41.png)

## Lista de control

- [x] Fase 0: Codespace, herramientas, repositorio privado, colaboradores y PRs.
- [x] Fase 1: Terraform validate/plan/apply, EC2, Security Group y outputs.
- [x] Fase 2: SSH por alias, clave propia y salto a workers.
- [x] Fase 3: conectividad, MTU 1450, cuatro nodos y manager líder.
- [x] Fase 4: imágenes 1.0/2.0, servicio y acceso por las IP públicas.
- [x] Fase 5: evidencias antes/durante/después de E1–E8.
