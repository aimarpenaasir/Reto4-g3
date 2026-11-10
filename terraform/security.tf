resource "aws_security_group" "cluster" {
  name        = "swarm-g${var.grupo}"
  description = "SG unico del cluster Swarm del grupo ${var.grupo}"
}

resource "aws_vpc_security_group_egress_rule" "salida" {
  security_group_id = aws_security_group.cluster.id
  ip_protocol       = "-1"
  cidr_ipv4         = "0.0.0.0/0"
}

# ---------- Desde fuera ----------
resource "aws_vpc_security_group_ingress_rule" "ssh" {
  security_group_id = aws_security_group.cluster.id
  ip_protocol       = "tcp"
  from_port         = 22
  to_port           = 22
  cidr_ipv4         = var.ip_ssh
}

resource "aws_vpc_security_group_ingress_rule" "http" {
  security_group_id = aws_security_group.cluster.id
  ip_protocol       = "tcp"
  from_port         = 80
  to_port           = 80
  cidr_ipv4         = "0.0.0.0/0"
}

resource "aws_vpc_security_group_ingress_rule" "web8080" {
  security_group_id = aws_security_group.cluster.id
  ip_protocol       = "tcp"
  from_port         = 8080
  to_port           = 8080
  cidr_ipv4         = "0.0.0.0/0"
}

# ---------- Solo entre nodos del mismo grupo de seguridad ----------
resource "aws_vpc_security_group_ingress_rule" "ssh_interno" {
  security_group_id            = aws_security_group.cluster.id
  referenced_security_group_id = aws_security_group.cluster.id
  ip_protocol                  = "tcp"
  from_port                    = 22
  to_port                      = 22
}

resource "aws_vpc_security_group_ingress_rule" "swarm_gestion" {
  security_group_id            = aws_security_group.cluster.id
  referenced_security_group_id = aws_security_group.cluster.id
  ip_protocol                  = "tcp"
  from_port                    = 2377
  to_port                      = 2377
}

resource "aws_vpc_security_group_ingress_rule" "swarm_nodos_tcp" {
  security_group_id            = aws_security_group.cluster.id
  referenced_security_group_id = aws_security_group.cluster.id
  ip_protocol                  = "tcp"
  from_port                    = 7946
  to_port                      = 7946
}

resource "aws_vpc_security_group_ingress_rule" "swarm_nodos_udp" {
  security_group_id            = aws_security_group.cluster.id
  referenced_security_group_id = aws_security_group.cluster.id
  ip_protocol                  = "udp"
  from_port                    = 7946
  to_port                      = 7946
}

resource "aws_vpc_security_group_ingress_rule" "swarm_overlay" {
  security_group_id            = aws_security_group.cluster.id
  referenced_security_group_id = aws_security_group.cluster.id
  ip_protocol                  = "udp"
  from_port                    = 4789
  to_port                      = 4789
}

resource "aws_vpc_security_group_ingress_rule" "icmp_interno" {
  security_group_id            = aws_security_group.cluster.id
  referenced_security_group_id = aws_security_group.cluster.id
  ip_protocol                  = "icmp"
  from_port                    = -1
  to_port                      = -1
}