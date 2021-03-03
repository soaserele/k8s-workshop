# ReplicaSets, DaemonSets and Deployments

Earlier we discussed that running Pods directly in Kubernetes is not something you should do. When this Pod is terminated for any reason (job terminated, pod failed, lack of resources, node failed), another Pod will not be automatically scheduled. A single pod is not scalable either. Manually running new pods when the load increases and terminating these pods during low traffic is not something you can do either. 

## ReplicaSet

A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. It is defined with fields, including a selector that specifies how to identify Pods it can acquire, a number of replicas indicating how many Pods it should be maintaining, and a pod template specifying the data of new Pods it should create to meet the number of replicas criteria. A ReplicaSet then fulfills its purpose by creating and deleting Pods as needed to reach the desired number. When a ReplicaSet needs to create new Pods, it uses its Pod template.

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
  labels:
    app: nginx
    tier: frontend
spec:
  replicas: 3                  # Number of replicas
  selector:                    # Pod selector. Match all pods with specified labels
    matchLabels:
      app: nginx
      tier: frontend
  template:                    # Pod template used to create new pods
    metadata:
      labels:
        app: nginx
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:1.17
```



```bash
$ kubectl create -f deployments/03-rs.yaml

$ kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
nginx-47n2c   1/1     Running   0          85s
nginx-pslmv   1/1     Running   0          85s
nginx-zct49   1/1     Running   0          85s

$ kubectl delete pod nginx-pslmv

$ kubectl get pods
NAME          READY   STATUS    RESTARTS   AGE
nginx-47n2c   1/1     Running   0          2m13s
nginx-tk8w8   1/1     Running   0          33s
nginx-zct49   1/1     Running   0          2m13s

$ kubectl delete -f deployments/03-rs.yaml
NAME          READY   STATUS        RESTARTS   AGE
nginx-47n2c   0/1     Terminating   0          11m
nginx-tk8w8   0/1     Terminating   0          9m58s
nginx-zct49   0/1     Terminating   0          11m

```

A ReplicaSet ensures that a specified number of pod replicas are running at any given time. However, a Deployment is a higher-level concept that manages ReplicaSets and provides declarative updates to Pods along with a lot of other useful features. This actually means that you may never need to manipulate ReplicaSet objects: use a Deployment instead, and define your application in the spec section.

## Deployments

Deployments represent a set of multiple, identical Pods with no unique identities. A Deployment runs multiple replicas of your application and automatically replaces any instances that fail or become unresponsive. In this way, Deployments help ensure that one or more instances of your application are available to serve user requests.

When a Deployment's Pod template is changed, new Pods are automatically created.

Using Deployments you can simply and reliably roll out new software versions without downtime or errors. There are different ways we can roll out new versions, like Recreate, Rolling Updates, Blue/Green deployments and Canary builds.

| Strategy     | Description                                                  | Zero downtime             | Real traffic testing      | Cost                      | Native support            | One version running       |
| ------------ | ------------------------------------------------------------ | ------------------------- | ------------------------- | ------------------------- | ------------------------- | ------------------------- |
| `Recreate`   | Kubernetes terminates all existing pods before the new one are created. With a recreate deployment strategy there is some downtime, however there won’t be 2 versions of the containers running at the same time | ![-](../images/times.png) | ![-](../images/times.png) | ![-](../images/check.png) | ![-](../images/check.png) | ![-](../images/check.png) |
| `Rolling`    | A rolling update strategy provides a controlled, phased replacement of the application's pods, ensuring that there are always a minimum number available. By default, Kubernetes makes sure that maximum of only 25% of Pods are unavailable at any time, and it also won’t over provision more than 25% of the number of pods specified in the desired state. | ![-](../images/check.png) | ![-](../images/times.png) | ![-](../images/check.png) | ![-](../images/check.png) | ![-](../images/times.png) |
| `Blue/Green` | The old version of the application (green) and the new version (blue) get deployed at the same time. When both of these are deployed, users only have access to the green; whereas, the blue is available to your QA team for test automation on a separate service or via direct port-forwarding. Once the acceptance criteria are passed, blue environment is promoted to green. | ![-](../images/check.png) | ![-](../images/times.png) | ![-](../images/times.png) | ![-](../images/times.png) | ![-](../images/check.png) |
| `Canary`     | The name of Canary Deployment Strategy has its origins rooted back to coal miners. A canary is used for when you want to test some new functionality. Traditionally you may have had two almost identical servers: one that goes to all users and another with the new features that gets rolled out to a subset of users and then compared. When no errors are reported, the new version can gradually roll out to the rest of the infrastructure. | ![-](../images/check.png) | ![-](../images/check.png) | ![-](../images/check.png) | ![-](../images/times.png) | ![-](../images/times.png) |

### Recreate

![Recreate strategy](../images/deploy-recreate.png)

```bash
$ kubectl create -f deployments/05-deploy-recreate.yaml
deployment.apps/nginx created

$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-5694dbd64d-5p7jk   1/1     Running   0          28s
nginx-5694dbd64d-dr87g   1/1     Running   0          28s
nginx-5694dbd64d-dvqzf   1/1     Running   0          28s


$ kubectl set image deploy nginx nginx=nginx:1.17
deployment.apps/nginx image updated

$ kubectl get pods
NAME                     READY   STATUS        RESTARTS   AGE
nginx-5694dbd64d-5p7jk   0/1     Terminating   0          76s
nginx-5694dbd64d-dr87g   0/1     Terminating   0          76s
nginx-5694dbd64d-dvqzf   0/1     Terminating   0          76s

$ kubectl get pods 
NAME                    READY   STATUS    RESTARTS   AGE
nginx-6cc555f4c-79zzb   1/1     Running   0          18s
nginx-6cc555f4c-8d2zm   1/1     Running   0          18s
nginx-6cc555f4c-lsvgk   1/1     Running   0          18s
```

### Rolling

![Recreate strategy](../images/deploy-rolling.png)

```bash
$ kubectl create -f deployments/06-deploy-rolling.yaml
deployment.apps/nginx created

$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-59958db4cb-7b8bl   1/1     Running   0          2m21s
nginx-59958db4cb-7jdbd   1/1     Running   0          2m21s
nginx-59958db4cb-fc75m   1/1     Running   0          2m21s
nginx-59958db4cb-h96cq   1/1     Running   0          2m21s

$ kubectl set image deploy nginx nginx=nginx:1.17
deployment.apps/nginx image updated

$ kubectl get pods
nginx-59958db4cb-7b8bl   0/1     Terminating         0          2m45s
nginx-59958db4cb-7jdbd   1/1     Running             0          2m45s
nginx-59958db4cb-fc75m   1/1     Running             0          2m45s
nginx-59958db4cb-h96cq   1/1     Running             0          2m45s
nginx-5cb7585c59-kk8wf   0/1     ContainerCreating   0          2s
nginx-5cb7585c59-q2glb   0/1     ContainerCreating   0          2s

$ kubectl get pods
NAME                     READY   STATUS        RESTARTS   AGE
nginx-59958db4cb-7jdbd   0/1     Terminating   0          2m52s
nginx-59958db4cb-fc75m   0/1     Terminating   0          2m52s
nginx-59958db4cb-h96cq   0/1     Terminating   0          2m52s
nginx-5cb7585c59-kk8wf   1/1     Running       0          9s
nginx-5cb7585c59-ldjlk   1/1     Running       0          6s
nginx-5cb7585c59-q2glb   1/1     Running       0          9s
nginx-5cb7585c59-q4xrh   1/1     Running       0          6s

$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-5cb7585c59-kk8wf   1/1     Running   0          17s
nginx-5cb7585c59-ldjlk   1/1     Running   0          14s
nginx-5cb7585c59-q2glb   1/1     Running   0          17s
nginx-5cb7585c59-q4xrh   1/1     Running   0          14s
```

### Blue/Green

![Recreate strategy](../images/deploy-bluegreen.png)

```bash
$ kubectl create -f 07-deploy-green.yaml 
deployment.apps/nginx-green created

$ kubectl get deployments
NAME          READY   UP-TO-DATE   AVAILABLE   AGE
nginx-green   4/4     4            4           47s

$ kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
nginx-green-5c588979c8-4mfc9   1/1     Running   0          57s
nginx-green-5c588979c8-gdkvl   1/1     Running   0          57s
nginx-green-5c588979c8-gpjkt   1/1     Running   0          57s
nginx-green-5c588979c8-zdhw6   1/1     Running   0          57s

$ kubectl create -f 07-deploy-blue.yaml 
deployment.apps/nginx-blue created

$ kubectl get deployments
NAME          READY   UP-TO-DATE   AVAILABLE   AGE
nginx-blue    4/4     4            4           54s
nginx-green   4/4     4            4           2m12s

$ kubectl get pods
NAME                           READY   STATUS    RESTARTS   AGE
nginx-blue-6ff5ccf854-5tx98    1/1     Running   0          61s
nginx-blue-6ff5ccf854-6mlqv    1/1     Running   0          61s
nginx-blue-6ff5ccf854-jfwtc    1/1     Running   0          61s
nginx-blue-6ff5ccf854-x2qrx    1/1     Running   0          61s
nginx-green-5c588979c8-4mfc9   1/1     Running   0          2m19s
nginx-green-5c588979c8-gdkvl   1/1     Running   0          2m19s
nginx-green-5c588979c8-gpjkt   1/1     Running   0          2m19s
nginx-green-5c588979c8-zdhw6   1/1     Running   0          2m19s
```

### Canary

![Recreate strategy](../images/deploy-canary.png)

```bash
$ kubectl create -f 08-deploy-stable.yaml 
deployment.apps/nginx-stable created

$ kubectl get deployments
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
nginx-stable   4/4     4            4           56s

$ kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
nginx-stable-5c588979c8-5mzmk   1/1     Running   0          88s
nginx-stable-5c588979c8-kxl86   1/1     Running   0          88s
nginx-stable-5c588979c8-wplh2   1/1     Running   0          88s
nginx-stable-5c588979c8-wxbk7   1/1     Running   0          88s

$ kubectl create -f 08-deploy-canary.yaml 
deployment.apps/nginx-canary created

$ kubectl get deployments
NAME           READY   UP-TO-DATE   AVAILABLE   AGE
nginx-canary   1/1     1            1           2m7s
nginx-stable   4/4     4            4           3m46s

$ kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
nginx-canary-6ff5ccf854-82864   1/1     Running   0          113s
nginx-stable-5c588979c8-5mzmk   1/1     Running   0          3m32s
nginx-stable-5c588979c8-kxl86   1/1     Running   0          3m32s
nginx-stable-5c588979c8-wplh2   1/1     Running   0          3m32s
nginx-stable-5c588979c8-wxbk7   1/1     Running   0          3m32s

$ kubectl scale deploy nginx-canary --replicas=4
deployment.apps/nginx-canary scaled

$ kubectl scale deploy nginx-stable --replicas=1
deployment.apps/nginx-stable scaled

$ kubectl get pods
NAME                            READY   STATUS    RESTARTS   AGE
nginx-canary-6ff5ccf854-6dlsd   1/1     Running   0          53s
nginx-canary-6ff5ccf854-82864   1/1     Running   0          3m24s
nginx-canary-6ff5ccf854-t6r7z   1/1     Running   0          53s
nginx-canary-6ff5ccf854-zt94h   1/1     Running   0          53s
nginx-stable-5c588979c8-kxl86   1/1     Running   0          5m3s

```

# DaemonSet

A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them. As nodes are removed from the cluster, those Pods are garbage collected. Deleting a DaemonSet will clean up the Pods it created.

Some typical uses of a DaemonSet are:

- running a node monitoring daemon on every node
- running a logs collection daemon on every node
- running a cluster storage daemon on every node