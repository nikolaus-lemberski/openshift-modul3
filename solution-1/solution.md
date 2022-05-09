# 1 - App Deployment | SOLUTION

```shell
oc new-project <username>-hello  
oc new-app --name hello nodejs:16-ubi8-minimal~https://github.com/nikolaus-lemberski/openshift-modul3 --context-dir hello-world

oc get all  
oc get pods  

oc logs -f <build-pod>  

oc exec -it <app-pod> -- /bin/bash  
> curl localhost:8080

oc expose <username>-hello  
oc get route  

curl <route>  

oc delete project <username>hello
```