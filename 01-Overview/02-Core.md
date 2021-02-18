# Core Components

There are some basic concepts and terms related to Kubernetes (K8s) that are important to understand before we head into setting up a Kubernetes cluster.

You can visualize a Kubernetes cluster as two parts: **the control plane** and the compute machines, or **nodes**. Each node could be either a physical or virtual machine and this is where pods will be launched.

<img src="../images/cluster.svg" alt="Kubernetes Cluster" />

### Control plane

Control plane hosts the components that control the cluster, along with data about the cluster’s state and configuration. These core Kubernetes components handle the important work of making sure your containers are running in sufficient numbers and with the necessary resources. 

### kube-apiserver

API Serer is the front end of the Kubernetes control plane, handling internal and external requests. The API server determines if a request is valid and, if it is, processes it. You can access the API through REST calls, through the kubectl command-line interface, or through other command-line tools such as kubeadm.

### kube-scheduler

The scheduler considers the resource needs of a pod, such as CPU or memory, along with the health of the cluster. Then it schedules the pod to an appropriate compute node. Factors taken into account for scheduling decisions include individual and collective resource requirements, hardware / software / policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference, and deadlines.

### kube-controller-manager

Controllers take care of actually running the cluster, and the Kubernetes controller-manager contains several controller functions in one. One controller consults the scheduler and makes sure the correct number of pods is running. If a pod goes down, another controller notices and responds. A controller connects services to pods, so requests go to the right endpoints. 

### etcd

etcd is a strongly consistent, distributed key-value store database. Configuration data and information about the state of the cluster lives in etcd. Fault-tolerant and distributed, etcd is designed to be the ultimate source of truth about your cluster. It is accessible only by Kubernetes API server as it may have some sensitive information.

### cloud-controller-manager

A component that embeds cloud-specific control logic. If you are running Kubernetes on your own premises, the cluster does not have a cloud controller manager.

## Worker nodes

### Nodes

A Kubernetes cluster needs at least one compute node, but will normally have many. Pods are scheduled and orchestrated to run on nodes. Need to scale up the capacity of your cluster? Add more nodes.

### kubelet

Each compute node contains a kubelet, a tiny application that communicates with the control plane. The kubelet makes sure containers are running in a pod. When the control plane needs something to happen in a node, the kubelet executes the action.

### kube-proxy

Each compute node also contains kube-proxy, a network proxy for facilitating Kubernetes networking services. The kube-proxy handles network communications inside or outside of your cluster - relying either on your operating system’s packet filtering layer, or forwarding the traffic itself.

### Pods

A pod is the smallest and simplest unit in the Kubernetes. It represents a single instance of an application/service. Each pod is made up of a container or a series of tightly coupled containers.

### Container Runtime Interface - CRI

The container runtime is the software that is responsible for running containers. Kubernetes supports several container runtimes: ~~Docker~~, containerd, CRI-O, and others. 

