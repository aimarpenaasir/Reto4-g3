locals {
  claves_publicas = [for f in fileset("${path.module}/keys", "*.pub") : trimspace(file("${path.module}/keys/${f}"))]
}