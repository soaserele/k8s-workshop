<img src="images/kubernetes.png" alt="Kubernetes" style="zoom:50%;" />

# k8s-workshop

Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation.

This workshop is for anyone who wants to understand Kubernetes concepts and use cases in order to design and develop scalable applications.



## Prerequisites

- Laptop
- Kubectl installed (https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- Basic knowledge of containers, container runtimes (Docker, containerd) and containerized applications
- (optional) Comfortable with UNIX command line tools (ssh, curl)
- (optional) Minikube. Access to a Kubernetes cluster will be provided during workshop



## Agenda

#### Kubernetes Overview

[A bit of history](./01-Overview/01-History.md)

[Core components](./01-Overview/02-Core.md)

[Using kubectl](./01-Overview/03-kubectl.md)

#### Workload

[Pods and containers](./02-Workload/01-Pods.md)

[Managing configurations and secrets](./02-Workload/02-ConfigMap.md)

[ReplicaSets, DaemonSets and Deployments](./02-Workload/03-Deployments.md)

[Services and Ingress](./02-Workload/04-Services.md)

[Liveness and Readiness Probe](./02-Workload/05-Probes.md)

[Basic Multi-Container patterns (Init, Adapter, Sidecar, Ambassador)](./02-Workload/06-Patterns.md)

#### Stateless applications

[Running stateless applications on Kubernetes](./03-Stateless/01-App.md)

[Scaling](./03-Stateless/02-Scaling.md)

[Jobs and CronJobs](./03-Stateless/03-Jobs.md)

#### Storage

[Container Storage Interface](./04-Storage/01-CSI.md)

[Volumes](./04-Storage/02-Volumes.md)

[PersistentVolume and PersistentVolumeClaim (PV and PVC)](./04-Storage/03-PVC.md)

[StorageClasses](./04-Storage/04-StorageClass.md)

#### Stateful applications

[StatefulSets](./05-Stateful/05-StatefulSets.md)

[Running stateful applications on Kubernetes](./05-Stateful/02-App.md)

#### Networking

[Container Network Interface](./06-Networking/01-CNI.md)

[Network policies](./06-Networking/02-Policies.md)