# Multi-Container Patterns

A pod that contains one container refers to a single container pod and it is the most common kubernetes use case. A pod that contains Multiple co-related containers refers to a multi-container pod. There are a few patterns for multi-container pods that we can find in the wild

## Init container 

A Pod can have multiple containers running apps within it, but it can also have one or more init containers, which are run before the app containers are started. Init containers are exactly like regular containers, except that  kubelet runs each init container sequentially, Init containers always run to completion and each Init container must complete successfully before the next one starts. If a Pod's init container fails, the kubelet repeatedly restarts that init container until it succeeds. However, if the Pod has a `restartPolicy` of Never, and an init container fails during startup of that Pod, Kubernetes treats the overall Pod as failed.

Because init containers have separate images from app containers, they have some advantages for start-up related code:

- Init containers can contain utilities or custom code for setup that are not present in an app image. For example, there is no need to make an image `FROM` another image just to use a tool like `sed`, `awk`, `python`, or `dig` during setup. By keeping unnecessary tools separate you can limit the attack surface of your app container image.
- Init containers offer a mechanism to block or delay app container startup until a set of preconditions are met. Once preconditions are met, all of the app containers in a Pod can start in parallel.

Init containers support all the fields and features of app containers, including resource limits, volumes, and security settings. However, the resource requests and limits for an init container are handled differently.

## Sidecar container

Imagine that you have the pod with a single container working very well and you want to add some functionality to the current container without touching or changing. Sidecar containers are the containers that run along with the main container in the pod and solve the discussed issue. Sidecar pattern extends and enhances the functionality of current containers without changing it. A few use-cases where sidecar pattern could make our lives easier:

1. **Monitoring ang logging**. There are a lot of monitoring and/or logging service providers. By implementing provider API into our main container, we add a tightly coupled dependency, which is not great in a micro-services world. By embracing sidecar container, we can offload the logging/monitoring work to a sidecar, which we can easily shift and also use multiple logging platform at once 
2. **Data and configurations sync**. This is simple way of updating application code. We can use a sidecar container that keeps the application updated at certain interval by running `git pull` command. This could prevent using a separate pipeline but this approach is not really scalable and should be used very carefully.

## Adapter container



## Ambassador container