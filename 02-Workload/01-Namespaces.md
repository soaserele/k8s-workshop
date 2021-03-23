# Namespace

Kubernetes supports multiple virtual clusters backed by the same physical cluster. These virtual clusters are called namespaces.

Namespaces are intended for use in environments with many users spread across multiple teams, or projectsand are a way to divide cluster resources between multiple users (via [resource quota](https://kubernetes.io/docs/concepts/policy/resource-quotas/)). For clusters with a few to tens of users, you should not need to create or think about namespaces at all. 

Namespaces provide a scope for names. Names of resources need to be unique within a namespace, but not across namespaces. Start using namespaces when you need the features they provide.

```bash
$ kubectl get namespaces
NAME              STATUS   AGE
default           Active   39d
kube-node-lease   Active   39d
kube-public       Active   39d
kube-system       Active   39d
```

Kubernetes usually starts with four initial namespaces:

- `default` The default namespace for objects with no other namespace
- `kube-system` The namespace for objects created by the Kubernetes system
- `kube-public` This namespace is created automatically and is readable by all users (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement.
- `kube-node-lease` This namespace is created automatically and stores Lease objects. Lease is a lightweight resource, which improves the performance of the node heartbeats as the cluster scales. Each Node has an associated Lease object in this namespace

> Avoid creating namespace with prefix kube-, since it is reserved for Kubernetes system namespaces.

## Creating a new namespace

```bash
$ kubectl create namespace playground # replace "playground" with the required namespace name 
namespace/playground created

$ kubectl get namespace
NAME              STATUS   AGE
default           Active   39d
kube-node-lease   Active   39d
kube-public       Active   39d
kube-system       Active   39d
playground        Active   85s

$ kubectl config view |grep namespace
namespace: default

$ kubectl config set-context --current --namespace=playground
Context "minikube" modified.

$ kubectl config view |grep namespace
namespace: playground
```
