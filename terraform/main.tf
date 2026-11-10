resource "aws_instance" "manager" {
  ami                    = var.ami
  instance_type          = var.tipo_manager
  key_name               = var.clave
  vpc_security_group_ids = [aws_security_group.cluster.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    hostname   = "manager-g${var.grupo}"
    claves_b64 = base64encode(join("\n", concat(local.claves_publicas, [""])))
  })

  root_block_device {
    volume_size = var.disco_manager
  }

  tags = {
    Name = "manager-g${var.grupo}"
  }
}

resource "aws_instance" "worker" {
  count                  = var.num_workers
  ami                    = var.ami
  instance_type          = var.tipo_worker
  key_name               = var.clave
  vpc_security_group_ids = [aws_security_group.cluster.id]

  user_data = templatefile("${path.module}/user_data.sh", {
    hostname   = "worker${count.index + 1}-g${var.grupo}"
    claves_b64 = base64encode(join("\n", concat(local.claves_publicas, [""])))
  })

  root_block_device {
    volume_size = var.disco_worker
  }

  tags = {
    Name = "worker${count.index + 1}-g${var.grupo}"
  }
}