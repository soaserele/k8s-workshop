# Stateless Application

In this example we will see an example of running a simple application in Kubernetes by using a Deployment object. Properties required to run the Pods will be specified using a ConfigMap. Also, we will expose the Application to the world using a Service object.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ccprice-config
data:
  currency_pair: BTC-USD
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echo
  labels:
    app: ccprice
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ccprice
  template:    
    metadata:
      labels:
        app: ccprice
    spec:
      containers:
      - name: ccprice
        image: soaserele/ccprice:1
        env:
        - name: CURRENCY_PAIR
          valueFrom:
            configMapKeyRef:
              name: ccprice-config
              key: currency_pair
        ports:
        - name: http
          protocol: TCP
          containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: ccprice
spec:
  type: NodePort
  selector:
    app: ccprice
  ports:
    - name: http
      protocol: TCP
      port: 8080
```

As long as we do not have to persist any data, we can scale this service without any concerns.