# Multi-Container Patterns

A pod that contains one container refers to a single container pod and it is the most common kubernetes use case. A pod that contains Multiple co-related containers refers to a multi-container pod. There are a few patterns for multi-container pods that we can find in the wild

## Init container 



## Sidecar container

Imagine that you have the pod with a single container working very well and you want to add some functionality to the current container without touching or changing. Sidecar containers are the containers that run along with the main container in the pod and solve the discussed issue. Sidecar pattern extends and enhances the functionality of current containers without changing it. A few use-cases where sidecar pattern could make our lives easier:

1. **Monitoring ang logging**. There are a lot of monitoring and/or logging service providers. By implementing provider API into our main container, we add a tightly coupled dependency, which is not great in a micro-services world. By embracing sidecar container, we can offload the logging/monitoring work to a sidecar, which we can easily shift and also use multiple logging platform at once 
2. **Data and configurations sync**. This is simple way of updating application code. We can use a sidecar container that keeps the application updated at certain interval by running `git pull` command. This could prevent using a separate pipeline but this approach is not really scalable and should be used very carefully.

## Adapter container



## Ambassador container