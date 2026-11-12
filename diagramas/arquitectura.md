# Arquitectura del clúster

```mermaid
flowchart TB
    alumno["Alumno / Codespace<br/>Terraform, AWS CLI y SSH"]
    hub["Docker Hub<br/>aimar06/f1-bilbao:1.0 / :2.0"]
    internet((Internet))
    subgraph aws["AWS us-east-1 · VPC por defecto · Security Group del grupo"]
        manager["manager-g3<br/>t3.medium · 20 GB<br/>Swarm manager"]
        worker1["worker1-g3<br/>t3.small · 10 GB<br/>Swarm worker"]
        worker2["worker2-g3<br/>t3.small · 10 GB<br/>Swarm worker"]
        worker3["worker3-g3<br/>t3.small · 10 GB<br/>Swarm worker"]
        ingress["red-g3<br/>Swarm ingress overlay<br/>MTU 1450"]
        service["web-f1-g3<br/>4 réplicas · HTTP :80"]
        manager --- ingress
        worker1 --- ingress
        worker2 --- ingress
        worker3 --- ingress
        ingress --> service
    end
    alumno -->|"Terraform / SSH"| manager
    alumno -. "ProxyJump · SSH por IP privada" .-> worker1
    alumno -. "ProxyJump · SSH por IP privada" .-> worker2
    alumno -. "ProxyJump · SSH por IP privada" .-> worker3
    hub -->|"pull de imagen"| service
    internet -->|"HTTP :80"| manager
    internet -->|"HTTP :80"| worker1
    internet -->|"HTTP :80"| worker2
    internet -->|"HTTP :80"| worker3
```

Los nombres e IPs son específicos del grupo 3. Las IPs públicas se consultan en
los outputs de Terraform y pueden cambiar al recrear las instancias; el tráfico
del clúster y los saltos SSH a workers usan IPs privadas.
