# OpenShift Workshop - Modul 3

## Vorbereitung

Nehmt euren User `userX` und loggt euch im CodeReadyWorkspaces ein.

> Link kommt im Chat

Default Credentials:

Username:
`userX` (z.B. `user25`)
Password:
`r3dh4t1!`

Geh mit Maus links über deinen Workspace (z.b. user25-workspace), öffne das Menü (3 Punkte) und klick auf "Edit Workspace"

![Edit Workspace](/images/codeready_workspaces_config.png "CodeReady Workspaces Config")

Kopiere folgende YAML in das Textfeld und klick auf "Save"

```
https://raw.githubusercontent.com/nikolaus-lemberski/openshift-modul3/main/cluster-preperation/workshop-tools/workshop-devfile.yaml
```

Danach öffne wieder das Menü an deinem Workspace und klick auf "Restart Workspace"
Das erstellen der Workspaces wird jetzt ein wenig dauern (da alle gleichzeitig starten).

Wenn der Workspace startet, bekommt ihr unten rechts 3 Popups

> Do you trust the authors of https://github.com/nikolaus-lemberski/openshift-modul3.git ?

klickt hier auf `Yes, I trust`

> Do you trust the authors of https://github.com/quarkusio/quarkus-quickstarts.git ?

klickt hier auf `Yes, I trust`

> Do you want to install the recommended extensions redhat/java,vscode/typescript-language-features for your workspace ?

klickt hier auf `No`


In dem Workspace findet ihr ein paar Beispielprojekte und ein paar "Tooling" Container. 
Die Tooling Container findet ihr rechts, wenn ihr auf das "Box" Icon klickt (Rechte Tooling Leiste, drittes Icon von oben)

Öffnet `openshift-tools` und klickt auf `New terminal`. Wählt als `working dir` `modul3` aus.

Es öffnet sich jetzt ein neues Terminal, in welchem ihr euch noch via `oc` CLI anmelden könnt

> ersetzt `userX` durch euren Benutzernamen

`oc login --insecure-skip-tls-verify https://${KUBERNETES_SERVICE_HOST} -u userX -p r3dh4t1!`

Nach der Eingabe des Passwortes sind wir erfolgreich eingeloggt und erhalten eine Willkommens-Nachricht von OpenShift.
Username und Adresse werden vom Trainer für jeden Teilnehmer zur Verfügung gestellt. Anschließend loggen wir uns noch in die Web Konsole von OpenShift ein (Adresse wird ebenfalls vom Trainer zur Verfügung gestellt).

## 1 - App Deployment

> **⚠ HINWEIS:**  
> Bitte alle Aufgaben selbst lösen und dann über die [Lösung](solutions/solution-1/) prüfen, ob alles richtig gemacht wurde.

### Projekt erstellen

Alle Applikationen in OpenShift werden in Projekten organisiert. In einem Projekt können viele Applikationen enthalten sein, sie befinden sich im gleichen _namespace_ und können miteinander über Services kommunizieren.

Als erstes erstellen wir ein Projekt **hello** über die OpenShift CLI. Damit wir mit den Projektnamen nicht durcheinanderkommen, stellt jeder vor den Projektnamen seinen Usernamen, also z.B. **user123-hello**.

### Applikation bauen und deployen

In unserem neuen Projekt deployen wir eine fertige nodejs Anwendung über OpenShift Source-to-Image (s2i). Über `oc new-app -h` kann die Hilfe aufgerufen werden, wie eine Applikation aus einem Git repository von OpenShift gebaut und deployed werden kann.

Die Applikation:
* liegt in Git unter folgender Adresse:  
https://github.com/nikolaus-lemberski/openshift-modul3
* dort im Unterordner (context directory) _projects/project-1_
* erhält als Applikationsnamen "hello"
* nutzt nodejs in der Version 14 mit dem ubi8 baseimage, als ImageStream _openshift/nodejs:14-ubi8-minimal_ in OpenShift bereitgestellt
Hinweis: es muss kein Dockerfile erstellt werden!
* als build strategy soll _source_ verwendet werden

Über `oc get all` kann alles, was der `oc new-app` command erstellt hat, angesehen werden. Es werden zwei pods gebaut, erst ein "build" pods der die Anwendung baut, danach der pod mit der Anwendung.

**Zusatzaufgaben:** 

* Den Build Log verfolgen
* Eine shell im container der app öffnen und mit curl den app root öffnen
* Die Applikation in der Web Konsole, Developer Perspektive untersuchen

### Health Checks

Health Checks dienen in Kubernetes dazu, dass Kubernetes den Status einer Anwendung überprüfen kann und sollte der Health Check fehlschlagen, die Anwendung neu startet. Health Checks können bei der Erstellung einer Anwendung über das Deployment oder die DeploymentConfig konfiguriert werden. Bei einer bestehenden Anwendung wird der Health Check am einfachsten über die Web Konsole konfiguriert.

Die Anwendung stellt zwei Health Checks bereit:

* `/health/readiness`  
Der readiness check, der - sobald erfolgreich - an OpenShift das Signal gibt, dass nun traffic an die Anwendung geroutet werden darf.
* `/health/liveness`  
Der liveness check, der von OpenShift kontinuierlich überprüft wird. Schlägt die liveness probe fehl, wird der pod mit der Anwendung automatisch gestoppt. Da dann weniger pods aktiv sind als im ReplicaSet vorgebeben, wird automatisch ein neuer pod mit der Anwendung erstellt.

**Aufgabe:** Konfiguration von readiness und liveness Health Checks über die Web Konsole.

### Applikation öffentlich aufrufbar machen

Zuletzt erstellen wir eine _route_ für die app, um diese öffentlich aufrufbar zu machen, und testen (z.B. mit curl), ob die Anwendung erreichbar ist.

### Projekt löschen

Um Ressourcen für weitere Projekte freizugeben, löschen wir das Projekt wieder.


## 2 - App Deployment mit Fehlersuche

> **⚠ HINWEIS:**  
> Bitte alle Aufgaben selbst lösen und dann über die [Lösung](solutions/solution-2/) prüfen, ob alles richtig gemacht wurde.

## Projekt erstellen

Wie gehabt erstellen wir wieder ein Projekt, diesmal mit dem Namen **nodeapp** und vorangestelltem Usernamen, also nach dem Schema  **user123-nodeapp**.

Zuerst speichern wir das folgende Deploymentfile als "Deployment.yml" im Ordner `modul3`:

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

Anschließend deployen wir die Applikation in unserem neu erstellten Projekt:  
`oc create -f Deployment.yml`

## Fehlersuche und -behebung

Nachdem die app erstellt ist, wird der pod mit der app crashen. Die Aufgabe ist nun, die Ursache für den crash zu finden und das Problem zu beheben.

### Applikation öffentlich aufrufbar machen

Nachdem das Problem erfolgreich behoben wurde, erstellen wir eine _route_ für die app, um diese öffentlich aufrufbar zu machen, und testen (z.B. mit curl), ob die Anwendung erreichbar ist.

### Projekt löschen

Um Ressourcen für weitere Projekte freizugeben, löschen wir das Projekt wieder.


## 3 - Helm

> **⚠ HINWEIS:**  
> Bitte alle Aufgaben selbst lösen und dann über die [Lösung](solutions/solution-3/) prüfen, ob alles richtig gemacht wurde.

## Projekt erstellen

Wie gehabt erstellen wir wieder ein Projekt, diesmal mit dem Namen **helmapp** und vorangestelltem Usernamen, also nach dem Schema  **user123-helmapp**.

## Helm installieren

Helm ist ein Paketmanager für Kubernetes und erlaubt - neben dem Deployment fertiger Anwendungen als helm chart - die Erstellung eigener Anwendungslandschaften. Dazu installieren wir Helm auf unserem Rechner, falls noch nicht vorhanden:

[Helm](https://helm.sh/docs/intro/install/)

Wer zum ersten mal mit Helm zu tun hat, kann also Vorbereitung den [Helm Chart Template Guide](https://helm.sh/docs/chart_template_guide/getting_started/) durcharbeiten. 

## Helm Chart erstellen

Wir erstellen ein neues Helm Chart mit dem Namen **tasks**:  
`helm create tasks`

Und wechseln in das neu erstellte Verzeichnis _tasks_.

Unsere app besteht aus einer Java Spring Anwendung, die eine REST Schnittstelle anbietet und Daten in einer Datenbank (MariaDB) speichert. Wir möchten die Java Anwendung mit der Datenbank zusammen in unserem Helm Chart konfigurieren und über Helm deployen.

### MariaDB hinzufügen

Wir möchten MariaDB als fertiges Helm Chart von Bitnami beziehen. Dazu fügen wir zuerst das Bitnami Repo hinzu:  
`helm repo add bitnami https://charts.bitnami.com/bitnami`  

Und konfigurieren in _Chart.yaml_ die MariaDB als _dependency_. Dazu fügen wir am Ende von _Chart.yaml_ an:  
```yaml
dependencies:
- name: mariadb
  version: 9.3.11
  repository: https://charts.bitnami.com/bitnami
```

Ein anschließendes `helm dependency update` lädt die MariaDB in das Projekt.

In _values.yaml_ erfolgt nun noch die Konfiguration der  MariaDB:

```yml
mariadb:
  auth:
    username: tasksuser
    password: supersecretpwd
    database: tasksdb
  primary:
    podSecurityContext:
      enabled: false
    containerSecurityContext:
      enabled: false
```

Damit die dependency hinzugefügt wird, weisen wir Helm zum Aktualisieren der Abhängigkeiten an:  
`helm dependency update`

### Java Anwendung hinzufügen

Ebenfalls in _values.yaml_ wird das _image_ für unsere Java Anwendung konfiguriert. In _values.yml_ am Anfang den _image_ Eintrag wie folgt aktualisieren:

```yaml
image:
  repository: quay.io/nlembers/spring-tasks
  pullPolicy: IfNotPresent
  tag: "v1.1"
```

Die Spring Anwendung benötigt die Zugangsdaten für die Datenbank sowie den Treibernamen. Diese müssen als environment Variablen übergeben werden. Environment Variablen werden in _values.yaml_ hinzugefügt und müssen dann noch im Deployment (_/templates/deployment.yaml_) über das Helm templating eingelesen werden.

In _values.yaml_ fügen wir ganz unten die environment Variablen der MariaDb hinzu:

```yaml
env:
  - name: "SPRING_DATASOURCE_DRIVER_CLASS_NAME"
    value: "org.mariadb.jdbc.Driver"
  - name: "SPRING_DATASOURCE_URL"
    value: "jdbc:mariadb://tasks-mariadb:3306/tasksdb"
  - name: "SPRING_DATASOURCE_USERNAME"
    value: "tasksuser"
  - name: "SPRING_DATASOURCE_PASSWORD"
    value: "supersecretpwd"
```

Im file _templates/deployment.yml_ in der _containers_ section unterhalb von _imagePullPolicy_ hinzufügen (auf korrekte Einrückung achten!):

```yaml
env:
  {{- range .Values.env }}
- name: {{ .name }}
  value: {{ .value }}
  {{- end }}
```

Gleich darunter die ports und probes konfigurieren und auf port 8080 umstellen:

```yaml
ports:
  - name: http
    containerPort: 8080
    protocol: TCP
livenessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
readinessProbe:
  httpGet:
    path: /actuator/health
    port: 8080
```

### Anwendung installieren

In unserem Verzeichnis _tasks_ nutzen wir Helm für die Installation:  
`helm install tasks .`

### Anwendung testen

Wie in den vorherigen Übungen können wir nun über `oc get all`, `oc logs` etc. die Anwendung prüfen. Läuft alles korrekt, erstellen wir eine Route auf den Service der Java Anwendung und rufen diese im Browser unter dem Pfad *'/api'* auf. Es öffnet sich ein HAL Explorer, mit dem man mit dem REST Service interagieren kann. Curl oder httpie etc. können natürlich ebenso verwendet werden.

**Zusatzaufgaben:** 

* Erstellen von ein paar Tasks über den HAL Explorer oder curl
* Eine shell in die MariaDB öffnen
* In der MariaDB die Tabelle in der tasksdb auf das Vorhandensein der erstellten Tasks prüfen

### Projekt löschen

Um Ressourcen für weitere Projekte freizugeben, löschen wir das Projekt wieder.


## 4 - Service Mesh

> **⚠ HINWEIS:**  
> Bitte alle Aufgaben selbst lösen und dann über die [Lösung](solutions/solution-4/) prüfen, ob alles richtig gemacht wurde.

### Projekt erstellen

Wie gehabt erstellen wir zuerst ein Projekt **meshapp** mit vorangestelltem Username, also z.B. **userX-meshapp**.

Service Mesh ist bereits installiert und nun benötigen wir noch eine _ServiceMeshMemberRoll_ für unser neu erstelltes Projekt. Dazu erstellen wir die member roll im namespace _userX-istio_system_ (yaml file lokal speichern, den Usernamen anpassen und über die _oc cli_ anwenden):

```yaml
apiVersion: maistra.io/v1
kind: ServiceMeshMemberRoll
metadata:
  name: default
  namespace: userX-istio-system 
spec:
  members:
    - userX-meshapp
  ```

### Anwendung deployen

Anschließend deployen wir 3 kleine Anwendungen:

#### Customer

```
curl -H \
  "Accept: application/vnd.github.v4.raw" \
  -L "https://api.github.com/repos/nikolaus-lemberski/openshift-modul3/contents/projects/project-4/customer.yml" \
  | kubectl create -f -
```

Anschließend erstellen wir ein virtuelles Gateway, über das wir das Projekt aufrufen können. Da wir ein Service Mesh verwenden, möchten wir den gesamten traffic durch das Service Mesh routen und verwenden daher nicht wie sonst eine _route_.

```
curl -H \
  "Accept: application/vnd.github.v4.raw" \
  -L "https://api.github.com/repos/nikolaus-lemberski/openshift-modul3/contents/projects/project-4/customer-gateway.yml" \
  | kubectl create -f -
```

Nachdem das Gateway erstellt ist, können wir es von außen über _curl_ auf der Adresse des Service Mesh Gateway im Kontext-Pfad _/customer_ aufrufen:  
`curl istio-ingressgateway-USERNAME-istio-system.apps.cluster-XYZ-SEE-YOUR-OPENSHIFT-ADDRESS.opentlc.com/customer`  
Zum Beispiel: _istio-ingressgateway-user1-istio-system.apps.cluster-rdbr4.rdbr4.sandbox1817.opentlc.com/customer_

Interessant ist im Vergleich zu unseren vorherigen Projekten: In der READY Spalte von `oc get pods` stehen nun zwei (2/2) statt wie bisher eins (1/1). In jedem pod sind zwei container:

* der Container mit der Applikation
* der Container mit dem Service Mesh Proxy (Envoy Proxy)

Möchte man mit `oc exec` auf einen Container zugreifen, spezifiziert man den gewünschten über das `-c` flag.

Wir können nun mit curl den endpoint (_route_) aufrufen und bekommen folgenden response:
> customer => UnknownHostException: preference

#### Preference

Nun deployen wir die preference Anwendung:

```
curl -H \
  "Accept: application/vnd.github.v4.raw" \
  -L "https://api.github.com/repos/nikolaus-lemberski/openshift-modul3/contents/projects/project-4/preference.yml" \
  | kubectl create -f -
```

Wir können nun mit curl den endpoint (_route_) aufrufen und bekommen folgenden response:
> customer => Error: 503 - preference => UnknownHostException: recommendation

#### Recommendation

Die recommendation app wird für unser Szenario in zwei Versionen deployed:

```
curl -H \
  "Accept: application/vnd.github.v4.raw" \
  -L "https://api.github.com/repos/nikolaus-lemberski/openshift-modul3/contents/projects/project-4/recommendation-v1.yml" \
  | kubectl create -f -
```

```
curl -H \
  "Accept: application/vnd.github.v4.raw" \
  -L "https://api.github.com/repos/nikolaus-lemberski/openshift-modul3/contents/projects/project-4/recommendation-v2.yml" \
  | kubectl create -f -
```

Wir können nun mit curl den endpoint (_route_) aufrufen und bekommen folgenden response:
> customer => preference => recommendation v1 from 'recommendation-abc': 1

Und nach nochmaligem Aufruf:
> customer => preference => recommendation v2 from 'recommendation-xyz': 1

### Service Mesh konfigurieren

Aufgabe ist nun, das Service Mesh zu konfigurieren:

1. Die recommendation app liegt in zwei Versionen vor. Diese beiden Versionen sollen dem Service Mesh als _DestinationRule_ angegeben werden.  
Docs: [DestinationRule](https://istio.io/latest/docs/reference/config/networking/destination-rule/)
2. Als nächstes soll das Service Mesh angewiesen werden, Service-Calls auf den recommendation Service 50/50 zwischen v1 und v2 zu verteilen. Hierfür wird ein _VirtualService_ benötigt.  
Docs: [VirtualService](https://istio.io/latest/docs/reference/config/networking/virtual-service/)

Über curl kann nun das Ergebnis geprüft werden, ggf. auch zum Test die Last anders verteilt werden.

Nun fügen wir im recommendation-v2 service einen Fehler ein. Wir gehen mit `oc exec` in den app container von recommendation-v2 und rufen dort mit curl die Adresse **localhost:8080/misbehave** auf (wer experimentieren mag: der endpoint **localhost:8080/behave** stellt die app wieder auf funktionstüchtig). 

Anschließend überprüfen wir das Ergebnis durch mehrfachen Aufruf des customer Service.

Wir simulieren hier einen fehlerhaften Pod oder temporäre Netzwerk-Fehler. Das Service Mesh kann uns nun helfen, unsere Services mehr "resilient" gegen solche Fehler zu machen.

Dazu soll das oben erstellte _VirtualService_ geändert werden, so dass bei Fehlern ein _retry_ ausgeführt wird.

Ist alles korrekt konfiguriert, treten beim Aufruf des customer Service nun keine Fehler von recommendation-v2 mehr auf. Fehlerhafter response vom recommendation-v2 wird vom Service Mesh durch ein "retry" behoben.

### Observability

Das genannte Verhalten schauen wir uns nun in Kiali und Jaeger an.

### Projekt löschen

Zum Schluss löschen wir wieder das Projekt, um Ressourcen freizugeben.