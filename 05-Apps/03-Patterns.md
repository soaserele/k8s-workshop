# Multi-Container Patterns

A pod that contains one container refers to a single container pod and it is the most common kubernetes use case. A pod that contains Multiple co-related containers refers to a multi-container pod. There are a few patterns for multi-container pods that we can find in the wild

## Init container 

A Pod can have multiple containers running apps within it, but it can also have one or more init containers, which are run before the app containers are started. Init containers are exactly like regular containers, except that  kubelet runs each init container sequentially, Init containers always run to completion and each Init container must complete successfully before the next one starts. If a Pod's init container fails, the kubelet repeatedly restarts that init container until it succeeds. However, if the Pod has a `restartPolicy` of Never, and an init container fails during startup of that Pod, Kubernetes treats the overall Pod as failed.

Because init containers have separate images from app containers, they have some advantages for start-up related code:

- Init containers can contain utilities or custom code for setup that are not present in an app image. For example, there is no need to make an image `FROM` another image just to use a tool like `sed`, `awk`, `python`, or `dig` during setup. By keeping unnecessary tools separate you can limit the attack surface of your app container image.
- Init containers offer a mechanism to block or delay app container startup until a set of preconditions are met. Once preconditions are met, all of the app containers in a Pod can start in parallel.

Init containers support all the fields and features of app containers, including resource limits, volumes, and security settings. However, the resource requests and limits for an init container are handled differently.

## Sidecar container

Imagine that you have the pod with a single container working very well and you want to add some functionality to the current container without touching or changing it. Sidecar containers are containers that run along with the "main" container in the pod and make them better without changing it. A few use-cases where sidecar pattern could make our lives easier:

1. **Monitoring ang logging**. There are a lot of monitoring and/or logging service providers. By implementing provider API into our main container, we add a tightly coupled dependency, which is not great in a micro-services world. By embracing sidecar container, we can offload the logging/monitoring work to a sidecar, which we can easily shift and also use multiple logging platform at once 
2. **Data and configurations sync**. This is simple way of updating application code. We can use a sidecar container that keeps the application updated at certain interval by running `git pull` command. This could prevent using a separate pipeline but this approach is not really scalable and should be used very carefully.

## Adapter container

Adapter container is a specialization of Sidecar containers. Adapter containers standardize and normalize output.  Consider the task of monitoring N different applications.  Each application may be built with a different way of exporting monitoring data. (e.g. JMX, StatsD, application specific statistics) but every monitoring system expects a consistent and uniform data model for the monitoring data it collects.  By using the adapter pattern of composite containers, you can transform the heterogeneous data from different systems into a single unified representation by creating Pods that groups the application containers with adapters that know how to do the transformation.  

Most of the time these adapter containers are simple and small that consume fewer resources than the main container.

Adapter container use case:

1. Convert or standardize the messaging format 

## Ambassador container

Imagine that you have the pod with one container running successfully and you need to access external services. But, these external services are dynamic in nature or difficult to access. Sometimes there is a different format that external service returns. There are some other reasons as well and you don’t want to handle this complexity in the main container. So, we use the Ambassador containers to handle these kinds of scenarios.

Ambassador container use cases:

1. Hide the complexity from main container
2. Handle communication with external services



