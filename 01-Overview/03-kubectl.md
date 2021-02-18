# Using kubectl

The core of Kubernetes' control plane is the API server. The Kubernetes API lets you query and manipulate the state of API objects in Kubernetes (for example: Pods, Namespaces, ConfigMaps, and Events).

Most operations can be performed through the kubectl command-line interface, which in turn use the API. 

For details about each command, including all the supported flags and subcommands, see the [kubectl](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands/) reference documentation. 

## Examples

```bash
# List all nodes
$ kubectl get nodes

# Show metrics for all nodes (metrics-server required)
$ kubectl top node

# Show metrics for a specific pod and its containers
$ kubectl top pod <pod name> --containers

# Create a deployment of nginx server 
$ kubectl create deployment nginx --image=nginx:1.17 --port=80 --replicas=3

# and expose it via kubectl expose ...
$ kubectl expose deployment nginx --type "NodePort" --port 80
# ... or create a service manually
$ kubectl create service nodeport nginx --tcp=8080:80

# Need help creating deployment files? Use --dry-run=client -o yaml arguments
$ kubectl run nginx --image=nginx:1.17 --dry-run=client -o yaml

# Create the environment using a definitions yaml file 
$ kubectl apply -f app.yaml
```

