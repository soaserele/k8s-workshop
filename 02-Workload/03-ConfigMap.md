# ConfigMaps and Secrets

One of best practice in operating containers is to ensure that containers are immutable and than the containers does not contain any critical information, such as passwords, ssh keys, API keys. Another practice is promoting the same container through various runtime environments, typically with increasing level of maturity (dev -> stage -> test -> uat -> live). To embrace these best practices we need a way to inject configuration into the container at the runtime. 

In Kubernetes we can use both ConfigMaps and Secrets to inject configuration in containers as environment variables or files.

ConfigMap is an API object used to store non-confidential data in key-value pairs. If the data you want to store is confidential, use a Secret. 

```bash
$ kubectl create configmap dbconfig --from-literal=db_host=localhost --from-literal=db_port=3306

$ kubectl get configmap dbconfig
NAME       DATA   AGE
dbconfig   2      9s

$ kubectl describe cm dbconfig
Name:         dbconfig
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
db_host:
----
localhost
db_port:
----
3306
Events:  <none>
```

Sometimes it is easier to pass a file as an input to create a configmap

```bash
$ touch app.prop
$ echo "title=Application" >>app.prop
$ echo "version=1.0.0" >>app.prop
$ kubectl create configmap appconfig --from-file=app.prop

$ kubectl describe configmap appconfig
Name:         appconfig
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
app.prop:
----
title=Application
version=1.0.0

Events:  <none>

```

As we discussed earlier, ConfigMaps should not be used for sensitive information, such us usernames and passwords. Kubernetes Secrets let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys. Storing confidential information in a Secret is safer and more flexible than putting it verbatim in a Pod definition or in a container image. Kubernetes Secrets are, by default, stored as unencrypted base64-encoded strings. In order to secure your secrets, it is recommended to enable Encryption at Rest and RBAC rules to restrict access to the cluster.

When creating a Secret, you can specify its type using the `type` field of the Secret. Kubernetes provides several builtin types for some common usage scenarios. These types vary in terms of the validations performed and the constraints Kubernetes imposes on them. For a full list, please visit the official [documentation](https://kubernetes.io/docs/concepts/configuration/secret/#secret-types).

| Builtin Type                          | Usage                                   |
| ------------------------------------- | --------------------------------------- |
| `Opaque`                              | arbitrary user-defined data             |
| `kubernetes.io/service-account-token` | service account token                   |
| `kubernetes.io/dockercfg`             | serialized `~/.dockercfg` file          |
| `kubernetes.io/dockerconfigjson`      | serialized `~/.docker/config.json` file |
| `kubernetes.io/basic-auth`            | credentials for basic authentication    |
| `kubernetes.io/ssh-auth`              | credentials for SSH authentication      |
| `kubernetes.io/tls`                   | data for a TLS client or server         |

`Opaque` is the default Secret type if omitted from a Secret configuration file. When you create a Secret using `kubectl`, you will use the `generic` subcommand to indicate an `Opaque` Secret type.

```bash
$ kubectl create secret generic dbsecret  --from-literal=db_user=root --from-literal=db_pass=password

$ kubectl describe secret dbsecret
Name:         dbsecret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
db_pass:  8 bytes
db_user:  4 bytes

$ kubectl get secret dbsecret -o jsonpath="{.data.db_user}" | base64 --decode
root


```

##  Using ConfigMaps and Secrets

ConfigMaps and Secrets can be mounted as data volumes or exposed as environment variables to be used by a container in a Pod. 

```bash
$ kubectl create -f deployments/02-dbconfig.yaml

$ kubectl get cm
NAME               DATA   AGE
appconfig          1      106s
dbconfig           2      106s

$ kubectl get secret
NAME                  TYPE                                  DATA   AGE
dbsecret              Opaque                                2      2m9s

$ kubectl exec cmdemo -- env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root

$ kubectl exec cmdemo -- ls /config
app
db

$ kubectl exec cmdemo -- cat /config/app/app.properties
title=Application
version=1.0.0

$ kubectl exec cmdemo -- cat /config/db/db_pass
password


$ kubectl delete -f deployments/02-dbconfig.yaml
```

When a ConfigMap or a Secret that is currently consumed in a volume is updated, projected keys are eventually updated as well. The kubelet checks whether the mounted Object is fresh on every periodic sync. However, the kubelet uses its local cache for getting the current value.

ConfigMaps/Secrets consumed as environment variables are not updated automatically and require a pod restart. 