# Service Mesh

Installation:  
https://docs.openshift.com/container-platform/4.10/service_mesh/v2x/installing-ossm.html

Control Plane (in neu zu erstellendem Projekt "istio-system"):  
https://docs.openshift.com/container-platform/4.10/service_mesh/v2x/ossm-create-smcp.html#ossm-create-smcp

ServiceMeshMemberRoll für alle Userprojekte (Namensschema \<username\>-meshapp) erstellen:

```yaml
apiVersion: maistra.io/v1
kind: ServiceMeshMemberRoll
metadata:
  name: default
  namespace: istio-system
spec:
  members:
    # a list of projects joined into the service mesh
    - your-project-name
    - another-project-name
    - ...
```

Und für alle Projekte:
`oc adm policy add-scc-to-user privileged -z default -n <projectname>`