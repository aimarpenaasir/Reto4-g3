output "manager" {
  value = {
    nombre     = aws_instance.manager.tags["Name"]
    id         = aws_instance.manager.id
    ip_publica = aws_instance.manager.public_ip
    ip_privada = aws_instance.manager.private_ip
  }
}

output "workers" {
  value = [for w in aws_instance.worker : {
    nombre     = w.tags["Name"]
    id         = w.id
    ip_publica = w.public_ip
    ip_privada = w.private_ip
  }]
}