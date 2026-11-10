variable "region" {
  default = "us-east-1"
}

variable "grupo" {
  description = "Número de grupo (la X de manager-gX)"
  type        = number
  default     = 3 # <-- CAMBIA ESTO
}

variable "ami" {
  default = "ami-033ea4ff4a9c726dc"
}

variable "tipo_manager" {
  default = "t3.medium"
}

variable "tipo_worker" {
  default = "t3.small"
}

variable "disco_manager" {
  default = 20
}

variable "disco_worker" {
  default = 10
}

variable "num_workers" {
  default = 3
}

variable "clave" {
  default = "vockey"
}

variable "ip_ssh" {
  description = "IP o rango desde donde se permite SSH (aula/alumno)"
  default     = "0.0.0.0/0" # mejor restringirlo, p. ej. "85.60.1.2/32"
}