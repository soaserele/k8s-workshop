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

[Namespaces](./02-Workload/01-Namespaces.md)

[Pods and containers](./02-Workload/02-Pods.md)

[Startup, Liveness and Readiness Probe](./02-Workload/03-Probes.md)

[Managing configurations and secrets](./02-Workload/04-ConfigMap.md)

[ReplicaSets, DaemonSets and Deployments](./02-Workload/05-Deployments.md)

[Services](./02-Workload/06-Services.md)

[Autoscaling](./02-Workload/07-Scaling.md)

[Ingress](./02-Workload/08-Ingress.md)

[Jobs and CronJobs](./02-Workload/09-Jobs.md)

#### Running stateless applications in Kubernete

[Stateless Application](./03-Deployment/01-Stateless.md)

[Stateful Application with local volume](./03-Deployment/02-Local.md)

#### Storage

[Volumes](./04-Storage/01-Volumes.md)

[PersistentVolume (PV), PersistentVolumeClaim (PVC) and StorageClasses](./04-Storage/02-PV.md)

[Container Storage Interface](./04-Storage/03-CSI.md)

Running applications in Kubernete 

[Running stateful applications on Kubernetes](./05-Apps/01-App.md)

[StatefulSets](./05-Apps/02-StatefulSets.md)

[Basic Multi-Container patterns (Init, Adapter, Sidecar, Ambassador)](./05-Apps/03-Patterns.md)

#### Networking

[Container Network Interface](./06-Networking/01-CNI.md)

[Network policies](./06-Networking/02-Policies.md)