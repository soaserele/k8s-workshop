# Volumes

As we know, containers are ephemeral, which presents some problems for non-trivial applications. One problem is the loss of files when a container crashes. The kubelet restarts the container but with a clean state. A second problem occurs when sharing files between containers running together in a `Pod`. The Kubernetes volume abstraction solves both of these problems.

At its core, a volume is just a directory, possibly with some data in it, which is accessible to the containers in a pod. How that directory comes to be, the medium that backs it, and the contents of it are determined by the particular volume type used. Also, a Pod can use any number of volume types simultaneously. 

Kubernetes supports several types of volumes.

| Type                 | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| emptyDir             | An `emptyDir` volume is first created when a Pod is assigned to a node, and exists as long as that Pod is running on that node. As the name says, the `emptyDir` volume is initially empty. |
| hostPath             | A `hostPath` volume mounts a file or directory from the host node's filesystem into your Pod. |
| configMap            | A ConfigMap provides a way to inject configuration data into pods. |
| secret               | A `secret` volume is used to pass sensitive information, such as passwords, to Pods. `secret` volumes are backed by tmpfs (a RAM-backed filesystem) so they are never written to non-volatile storage. |
| awsElasticBlockStore | Mounts an Amazon Web Services EBS volume into your pod. EBS volume should be created BEFORE using it. |
| gcePersistentDisk    | Mounts a Google Compute Engine persistent disk into your Pod. PD volume should be created BEFORE using it. |
| azureDisk            | Mounts a Microsoft Azure Data Disk into a pod.               |
| cephfs               | Allows an existing CephFS volume to be mounted into your Pod. |
| glusterfs            | Allows a Glusterfs volume to be mounted into your Pod.       |
| nfs                  | An `nfs` volume allows an existing NFS (Network File System) share to be mounted into a Pod. |

