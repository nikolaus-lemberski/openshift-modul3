# 2 - App Deployment mit Fehlersuche | SOLUTION

## App erstellen

`oc new-project <username>-nodeapp`

Yaml content kopieren (<Ctrl>-C):  
```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeapp
  labels:
    app: nodeapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodeapp
  template:
    metadata:
      labels:
        app: nodeapp
    spec:
      containers:
      - name: nodeapp
        image: quay.io/nlembers/project-2:v1.0
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: nodeapp
spec:
  selector:
    app: nodeapp
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```
... und in einem file _Deployment.yml_ speichern.  

Z.B.  
```shell
cat > /path/to/dir/Deployment.yml  
<Ctrl>-V  
<Ctrl>-D
```

Deployment file anwenden:  
`oc create -f /path/to/dir/Deployment.yml`

## Fehlersuche

Zuerst prüfen wir die Logs, entweder über die Web Konsole oder über die cli: 

```shell
oc get pods
oc logs -f <podname>
```

## Fehlerbehebung

Die app benötigt die Environment Variable _APP_NAME_. Environment Variablen werden im Deployment file beim Container eingetragen, auf gleicher Höhe wie z.B. die 'ports' Angabe.

```yml
env:
- name: APP_NAME
  value: "Node App"
```

Das vollständige Deployment file sieht dann wie folgt aus:

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nodeapp
  labels:
    app: nodeapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nodeapp
  template:
    metadata:
      labels:
        app: nodeapp
    spec:
      containers:
      - name: nodeapp
        image: quay.io/nlembers/project-2:v1.0
        ports:
        - containerPort: 8080
        env:
        - name: APP_NAME
          value: "Node App"
---
apiVersion: v1
kind: Service
metadata:
  name: nodeapp
spec:
  selector:
    app: nodeapp
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
```

Wir deployen das überarbeitete Deployment file:  
`oc replace -f Deployment.yml`

Anschließend überprüfen wir wieder die Erstellung der Pods und die Logfiles (sh. oben).

## App öffentlich erreichbar machen

```shell
oc expose nodeapp  
oc get route  

curl <route>  
```

**Hinweis:** Die Route kann alternativ auch über die Web Konsole konfiguriert werden.

## Projekt löschen

`oc delete project <username>-nodeapp`