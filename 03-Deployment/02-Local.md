# Stateful Application with local volume

In this example we will see an example of running a multi-tier web application, a Wordpress site, in Kubernetes. When it comes to WordPress, the PHP scripting language is used to send and retrieve information from your MySQL database. One way to run MySQL database is to have it outside our cluster, on a bare metal node or a VM. Another way is to have Kubernetes run our MySQL database inside the cluster. For this example, MySQL database will store all the data on a local volume. This is NOT a recommended way to run stateful services, as in case the pod is terminated, all the data is lost.

![](../images/app-local.png)

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-config
data:
  database: wordpress
---
apiVersion: v1
kind: Secret
metadata:
  name: mysql-secret
data:
  username: d29yZHByZXNz
  password: dzByZHByMzU1
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wordpress
      tier: mysql
  template:
    metadata:
      labels:
        app: wordpress
        tier: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_RANDOM_ROOT_PASSWORD
          value: "yes"
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: username
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        - name: MYSQL_DATABASE
          valueFrom:
            configMapKeyRef:
              name: mysql-config
              key: database
        ports:
        - name: mysql
          containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
    tier: mysql
spec:
  selector:
    app: wordpress
    tier: mysql
  ports:
  - port: 3306
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
    tier: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wordpress
      tier: frontend
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
    spec:
      containers:
      - image: wordpress:5.7-apache
        name: wordpress
        env:
        - name: WORDPRESS_DB_HOST
          value: wordpress-mysql
        - name: WORDPRESS_DB_USER
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: username
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-secret
              key: password
        - name: WORDPRESS_DB_NAME
          valueFrom:
            configMapKeyRef:
              name: mysql-config
              key: database
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
    tier: frontend
spec:
  type: NodePort
  ports:
    - port: 80
  selector:
    app: wordpress
    tier: frontend
```


