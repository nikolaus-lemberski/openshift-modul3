# 1 - App Deployment | SOLUTION

## App erstellen

```sh
oc new-project <username>-hello  
oc new-app --name hello nodejs:16-ubi8-minimal~https://github.com/nikolaus-lemberski/openshift-modul3 --context-dir projects/project-1
```

## Pods und Container prüfen

```sh
oc get all  
oc get pods  

oc logs -f <build-pod>  

oc exec -it <app-pod> -- /bin/bash  
> curl localhost:8080
```

**Hinweis:** Die Logs können auch gut über die Web Konsole aufgerufen werden.

## Health Check konfigurieren
![OpenShift Web Console](healthchecks.png "OpenShift Web Console")

## App öffentlich erreichbar machen

```sh
oc expose svc hello  
oc get route  

curl <route>  
```

**Hinweis:** Die Route kann alternativ auch über die Web Konsole konfiguriert werden.

## Projekt löschen

`oc delete project <username>-hello`