# Services

As discussed earlier, Pods are ephemeral, disposable resources. Pods are created and destroyed to match the state of your cluster. A ReplicaSet or a Deployment automatically maintain a stable set of replica Pods running at any given time by creating or destroying pods dynamically. Each Pod gets its own IP address, however in a Deployment, the set of Pods running in one moment in time could be different from the set of Pods running that application a moment later. While the actual Pods that compose the application may change, the clients should not need to be aware of that, nor should they need to keep track of the pods themselves.

The idea of a Service is to group a set of Pod endpoints into a single resource. A Service is responsible for exposing an interface to the pods, which enables network access from either within the cluster or between external processes and the service. Services connect a set of pods to an abstracted service name and IP address, at the same time providing service discovery and routing between pods. By default, you get a stable cluster IP address that clients inside the cluster can use to contact Pods in the Service. A client sends a request to the stable IP address, and the request is routed to one of the Pods in the Service.

Since services are not node-specific, a service can point to a pod regardless of where it runs in the cluster at any given moment in time. Services can be exposed in different ways by specifying a `type` in the Service definition:

| Type                | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| ClusterIP (default) | Exposes the Service on an internal IP in the cluster. This type makes the Service only reachable from within the cluster |
| NodePort            | Exposes the Service on the same port of each selected Node in the cluster using NAT. Makes a Service accessible from outside the cluster using `<NodeIP>:<NodePort>` |
| LoadBalancer        | Public cloud providers only. Creates an external load balancer in the current cloud and assigns a fixed, external IP to the Service |
| ExternalName        | Exposes the Service using an alias (DNS CNAME record) to an external component residing outside the Kubernetes cluster. An incoming request for the service gets routed by Kubernetes DNS to the external domain specified. |

Describing a service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  type: ClusterIP         # Default service type 
  selector:
    app: nginx
  ports:
    - name: http
      protocol: TCP
      port: 8080
      targetPort: 80
    - name: https        # We can configure multiple port definitions if we need
      protocol: TCP
      port: 8443
      targetPort: 443
```

