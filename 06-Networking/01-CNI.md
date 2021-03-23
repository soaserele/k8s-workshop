# CNI

Networking is a central part of Kubernetes as Kubernetes is all about sharing machines between applications. Typically, sharing machines requires ensuring that two applications do not try to use the same ports. Coordinating ports across multiple developers is very difficult to do at scale and exposes users to cluster-level issues outside of their control. Rather than deal with this, Kubernetes takes a different approach.

Every `Pod` gets its own IP address. This means you do not need to explicitly create links between `Pods` and you almost never need to deal with mapping container ports to host ports. This creates a clean, backwards-compatible model where `Pods` can be treated much like VMs or physical hosts from the perspectives of port allocation, naming, service discovery, load balancing, application configuration, and migration.

There are 4 distinct networking problems to address:

1. Highly-coupled container-to-container communications
2. Pod-to-Pod communications
3. Pod-to-Service communications
4. External-to-Service communications

Kubernetes imposes the following fundamental requirements on any networking implementation (barring any intentional network segmentation policies):

- pods on a node can communicate with all pods on all nodes without NAT
- agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node

This model is not only less complex overall, but it is principally compatible with the desire for Kubernetes to enable low-friction porting of apps from VMs to containers. 

Kubernetes IP addresses exist at the `Pod` scope - containers within a `Pod` share their network namespaces - including their IP address and MAC address. This means that containers within a `Pod` can all reach each other's ports on `localhost`. This also means that containers within a `Pod` must coordinate port usage, but this is no different from processes in a VM. This is called the "IP-per-pod" model.

Kubernetes uses a plugin model for networking, using the CNI to manage network resources on a cluster. Most of the common CNI plugins utilize overlay networking, which creates a private layer 3 (L3) network internal to the cluster on top of the existing layer 2 (L2) network. With these CNI plugins, private networks are only accessible to the pods within the cluster. The process of moving packets between the nodes, or even outside the cluster, heavily relies on iptable rules and Network Address Translation (NAT) of the private and public IP addresses. 

The most popular CNI plugins are (but not limited to): 

| CNI Plugin | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| Flannel    | A very simple overlay network that satisfies the Kubernetes requirements. |
| Calico     | An open source networking and network security solution for containers, virtual machines, and native host-based workloads. Calico provides a full networking stack. |
| Weave      | A resilient and simple to use network for Kubernetes and its hosted applications. |
| Cilium     | An open source software for providing and transparently securing network connectivity at L7/HTTP. Cilium can enforce network policies  using an identity based security model that is decoupled from network addressing, and it can be used in combination with other CNI plugins. |
| Istio      | The CNI handling the netns setup replaces the current Istio Service Mesh approach using a `NET_ADMIN` privileged `initContainers` container, `istio-init`, injected in the pods along with `istio-proxy` sidecars. |