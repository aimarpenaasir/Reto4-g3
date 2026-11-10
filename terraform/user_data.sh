#!/bin/bash
# Script de arranque (user_data). Se ejecuta UNA vez, como root.

# 1. Hostname
hostnamectl set-hostname ${hostname}
echo "preserve_hostname: true" > /etc/cloud/cloud.cfg.d/99-hostname.cfg
echo "127.0.1.1 ${hostname}" >> /etc/hosts

# 2. Zona horaria
timedatectl set-timezone Europe/Madrid

# 3. Claves públicas de los alumnos (se añaden a la de vockey)
mkdir -p /home/ubuntu/.ssh
printf '%s' '${claves_b64}' | base64 -d >> /home/ubuntu/.ssh/authorized_keys
chown -R ubuntu:ubuntu /home/ubuntu/.ssh
chmod 700 /home/ubuntu/.ssh
chmod 600 /home/ubuntu/.ssh/authorized_keys

# 4. SSH sin root y sin contraseña
cat > /etc/ssh/sshd_config.d/00-seguridad.conf <<'CONF'
PermitRootLogin no
PasswordAuthentication no
CONF
systemctl restart ssh

# 5. Docker
apt-get update -y
apt-get install -y docker.io
systemctl enable --now docker
usermod -aG docker ubuntu