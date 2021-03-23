# Container Storage Interface

Prior to CSI Kubernetes provided a powerful volume plug-in system, but it was challenging for vendors to add support for new storage or even to fix issues in existing ones. As the code was part of Kubernetes core, vendors had to stick to Kubernetes release path.  In addition, third-party storage code caused reliability and security issues in core Kubernetes binaries and the code was often difficult for maintainers to test and maintain. 

CSI was developed as a standard for exposing arbitrary block and file storage storage systems to Kubernetes. With the adoption of the Container Storage Interface, the Kubernetes volume layer becomes truly extensible. Using CSI, third-party storage providers can write and deploy plugins exposing new storage systems in Kubernetes without ever having to touch the core Kubernetes code.

A CSI driver is typically deployed in Kubernetes as two components: a controller component and a per-node component.

- The controller component can be deployed as a Deployment or StatefulSet on any node in the cluster. It consists of the CSI driver that implements the CSI Controller service and one or more sidecar containers. These controller sidecar containers typically interact with Kubernetes objects and make calls to the driver's CSI Controller service.
- The node component should be deployed on every node in the cluster through a DaemonSet. It consists of the CSI driver that implements the CSI Node service and the node-driver-registrar.

You can find a CSI plugin for every major cloud provided block and/or object storage and for a lot of NFS providers: 

| Name                       | Single pod R/W            | Multiple pods R/W         |
| -------------------------- | ------------------------- | ------------------------- |
| AWS EBS                    | ![-](../images/check.png) | ![-](../images/times.png) |
| AWS EFS                    | ![-](../images/check.png) | ![-](../images/check.png) |
| AWS FSx for Lustre         | ![-](../images/check.png) | ![-](../images/check.png) |
| Azure disk                 | ![-](../images/check.png) | ![-](../images/times.png) |
| Azure file                 | ![-](../images/check.png) | ![-](../images/check.png) |
| Google Cloud Storage       | ![-](../images/check.png) | ![-](../images/check.png) |
| Google Filestore           | ![-](../images/check.png) | ![-](../images/check.png) |
| Google Persistent Disk     | ![-](../images/check.png) | ![-](../images/times.png) |
| DigitalOcean Block Storage | ![-](../images/check.png) | ![-](../images/times.png) |
| Yandex Compute Disk        | ![-](../images/check.png) | ![-](../images/times.png) |
| Alibaba Cloud Disk         | ![-](../images/check.png) | ![-](../images/times.png) |
| Alibaba Cloud NAS          | ![-](../images/check.png) | ![-](../images/check.png) |
| GlusterFS                  | ![-](../images/check.png) | ![-](../images/check.png) |
| Ceph RDB                   | ![-](../images/check.png) | ![-](../images/times.png) |
| CephFS                     | ![-](../images/check.png) | ![-](../images/check.png) |
| Longhorn                   | ![-](../images/check.png) | ![-](../images/times.png) |
| StorageOS                  | ![-](../images/check.png) | ![-](../images/check.png) |
| Portworx                   | ![-](../images/check.png) | ![-](../images/check.png) |

