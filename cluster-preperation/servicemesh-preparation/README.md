# Service Mesh

> **⚠ HINWEIS:**  
> In RHPDS -> "CCN Roadshow for Dev Track OCP 4.9" ist Service Mesh bereits installiert. Es muss nur für jeden User in _USERNAME_istio_system_ eine ServiceMeshMemberRoll erstellt werden. **Die User können das selbst erledigen**, Anleitung ist in der User-Anleitung enthalten!

## Installation:  

https://docs.openshift.com/container-platform/4.10/service_mesh/v2x/installing-ossm.html

### Kurzfassung:

In dieser Reihenfolge erstellen:  
1. OpenShift Elasticsearch
2. Red Hat OpenShift distributed tracing platform
3. Kiali
4. Red Hat OpenShift Service Mesh

Alles in den _openshift-operators_ namespace, nur ElasticSearch in den _openshift-operators-redhat_ namespace.

## Control Plane

Control Plane im Projekt "istio-system". Oder ein Control Plane für jeden User als userX-istio-system (ist in "CCN Roadshow for Dev Track OCP 4.9" bereits erstellt).

https://docs.openshift.com/container-platform/4.10/service_mesh/v2x/ossm-create-smcp.html#ossm-create-smcp

### Kurzfassung:

1. Projekt "istio-system" erstellen
2. In diesem Projekt die Control Plane mit den defaults installieren.

## Member Rolls

ServiceMeshMemberRoll für alle Userprojekte (Namensschema \<username\>-meshapp) erstellen:

`oc apply -f ./servicemeshmember.yaml`

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

## SCC Context

Und für alle Projekte(nachdem sie erstellt wurden):
`oc adm policy add-scc-to-user privileged -z default -n user{1..39}`