# HorizontalPodAutoscaling and VerticalPodAutoscaling

Auto-scaling is a way to automatically increase or decrease the number of computing resources that are being assigned to your application based on resource requirement at any given time.

## HorizontalPodAutoscaling

You can use the Kubernetes Horizontal Pod Autoscaler to automatically scale the number of pods in a deployment, replication controller, replica set, or stateful set, based on that resource's CPU or memory utilization, or on other metrics. The Horizontal Pod Autoscaler can help applications scale out to meet increased demand, or scale in when resources are no longer needed.

The HPA controller requires a metrics source. For scaling based on CPU and/or memory usage, it depends on the Kubernetes Metrics Server. There are some non-official services that provide custom metrics for HPA, such as Prometheus Adapter, Datadog Cluster Adapter, KEDA, and others.

From the most basic perspective, the Horizontal Pod Autoscaler controller operates on the ratio between desired metric value and current metric value:

```
desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]
```

For example, if the current metric value is `200m`, and the desired value is `100m`, the number of replicas will be doubled, since `200.0 / 100.0 == 2.0` If the current value is instead `50m`, we'll halve the number of replicas, since `50.0 / 100.0 == 0.5`. We'll skip scaling if the ratio is sufficiently close to 1.0 (within a globally-configurable tolerance, from the `--horizontal-pod-autoscaler-tolerance` flag, which defaults to 0.1).



## VerticalPodAutoscaler

Kubernetes Vertical Pod Autoscaler automatically adjust the resource requests and limits for containers running in a deployment's pods. The Vertical Pod Autoscaler can improve cluster resource utilization by:

- Setting the requests automatically based on usage to make sure the appropriate resource amount is available for each pod.
- Maintaining ratios between limits and requests that were specified in containers' initial configurations.
- Scaling down pods that are over-requesting resources, based on their usage over time.
- Scaling up pods that are under-requesting resources, based on their usage over time.

The VPA can set container resource limits based on live data, rather than human guesswork or benchmarks that are only occasionally run. Alternatively, some workloads may be prone to occasional periods of very high utilization, but permanently increasing their request limits would waste mostly unused CPU or memory resources and limit the nodes that can run them. While Horizontal Pod Autoscaling can help in many of those cases, sometimes the workload cannot easily be spread across multiple instances of an application.