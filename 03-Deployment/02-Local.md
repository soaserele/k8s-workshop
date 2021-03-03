# Stateful Application with local volume

In this example we will see an example of running a multi-tier web application, a Wordpress site, in Kubernetes. When it comes to WordPress, the PHP scripting language is used to send and retrieve information from your MySQL database. One way to run MySQL database is to have it outside our cluster, on a bare metal node or a VM. Another way is to have Kubernetes run our MySQL database inside the cluster. For this example, MySQL database will store all the data on a local volume. This is NOT a recommended way to run stateful services, as in case the pod is terminated, all the data is lost.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-config
data:
  db_password: password
---
apiVersion: v1
kind: Service
metadata:
  name: mysql
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-config
              key: db_password
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
  name: wordpress
  labels:
    app: wordpress
spec:
  type: NodePort
  ports:
    - port: 80
  selector:
    app: wordpress
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wordpress
  template:
    metadata:
      labels:
        app: wordpress
    spec:
      containers:
      - image: wordpress:5-apache
        name: wordpress
        env:
        - name: WORDPRESS_DB_HOST
          value: mysql
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-config
              key: db_password
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-storage
        emptyDir: {}
```


