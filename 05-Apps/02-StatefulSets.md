# StatefulSet

StatefulSet is the workload API object used to manage stateful applications. It manages the deployment and scaling of a set of Pods, and provides guarantees about the ordering and uniqueness of these Pods.

Unlike a Deployment, Pods in a StatefulSet have a unique identity that is comprised of an ordinal, a stable network identity, and stable storage.  The identity and sticks to the Pod regardless of which node it's scheduled on. These pods are created from the same spec, but are not interchangeable. StatefulSets are valuable for applications that require stable, persistent storage and ordered deployment and scaling.

### Scaling rules:

- For a StatefulSet with N replicas, when Pods are being deployed, they are created sequentially, in order from {0..N-1}.
- When Pods are being deleted, they are terminated in reverse order, from {N-1..0}.
- Before a scaling operation is applied to a Pod, all of its predecessors must be Running and Ready.
- Before a Pod is terminated, all of its successors must be completely shutdown.

