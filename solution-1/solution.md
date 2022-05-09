# 1 - App Deployment | SOLUTION

```shell
oc new-project <username>-tasks  
oc new-app --name tasks java:11~https://github.com/nikolaus-lemberski/spring-tasks --strategy source

oc get all  
oc get pods  

oc logs -f <build-pod>  

oc exec -it <app-pod> -- /bin/bash  
> curl localhost:8080

oc expose <username>-tasks  
oc get route  

curl <route>
```