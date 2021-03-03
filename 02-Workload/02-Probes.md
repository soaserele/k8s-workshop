# Startup, Liveness and Readiness Probe

When you’re designing a mission-critical, highly-available application, resiliency is one of the most important aspects to take into consideration. An application is resilient when it can quickly recover from failures. As you deploy and operate distributed applications, containers are created, started, run, and terminated. To check a container’s health in the different stages of its lifecycle, Kubernetes uses different types of probes:

| Probe type      | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| Startup probe   | Used to determine when a container application has been initialized successfully. The startup probe forces liveness and readiness checks to wait until it succeeds, so that the application startup is not compromised. That is especially beneficial for slow-starting legacy applications. If a startup probe fails, the pod is restarted. Once the startup probe has succeeded once, the liveness probe takes over to provide a fast response to container deadlocks. |
| Liveness probe  | Check if your app is alive. The *kubelet* agent that runs on each node uses the liveness probes to ensure that the containers are running as expected. If a container app is no longer serving requests, kubelet will intervene and restart the container. |
| Readiness probe | Kubernetes uses this probe to know when the container is ready to start accepting traffic. If a readiness probe fails, Kubernetes will stop routing traffic to the pod until the probe passes again. .A pod is considered ready when all of its containers are ready. That helps Kubernetes control which pods are used as backends for services. If not ready, a pod is removed from service load balancers. |

```yaml
apiVersion: v1 
kind: Pod 
metadata: 
  name: nginx 
spec: 
  containers: 
  - name: nginx 
    image: nginx:1.17
    startupProbe:
      httpGet:	
        path: /
        port: 80
      periodSeconds: 5
      failureThreshold: 30
    livenessProbe:
      httpGet:	
        path: /
        port: 80
      initialDelaySeconds: 30
      periodSeconds: 5
      timeoutSeconds: 1
      failureThreshold: 5
    readinessProbe:
      httpGet:	
        path: /
        port: 80
      initialDelaySeconds: 30
      periodSeconds: 5
      timeoutSeconds: 1
      failureThreshold: 3
      successThreshold: 3
```

| Parameter           | Default | Description                                                  |
| ------------------- | ------- | ------------------------------------------------------------ |
| initialDelaySeconds | 0       | Number of seconds after the container has started before liveness or readiness probes are initiated. |
| periodSeconds       | 10      | How often to perform the probe.                              |
| timeoutSeconds      | 1       | Number of seconds after which the probe times out. Before Kubernetes 1.20, the field `timeoutSeconds` was not respected for exec probes. |
| successThreshold    | 1       | Minimum consecutive successes for the probe to be considered successful after having failed. Must be 1 for liveness and startup Probes. |
| failureThreshold    | 3       | When a probe fails, Kubernetes will try `failureThreshold` times before giving up. Giving up in case of startup and liveness probe means restarting the container. In case of readiness probe the Pod will be marked Unready. |

