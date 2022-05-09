# OpenShift Workshop - Modul 3

## Vorbereitung

Da wir heute "hands on" machen, benötigen wir die OpenShift cli (ein Superset über _kubectl_, das CLI zur Interaktion mit Kubernetes Clustern). Download und Installationsanleitung:

[OpenShift CLI](https://docs.openshift.com/container-platform/4.10/cli_reference/openshift_cli/getting-started-cli.html)

Nach der Installation loggen wir uns ein mit 

`oc login -u <username> <openshift_api_address>`  
Nach der Eingabe des Passwortes sind wir erfolgreich eingeloggt und erhalten eine Willkommens-Nachricht von OpenShift.

Username und Adresse werden vom Trainer für jeden Teilnehmer zur Verfügung gestellt. Anschließend loggen wir uns noch in die Web Konsole von OpenShift ein (Adresse wird ebenfalls vom Trainer zur Verfügung gestellt).

## 1 - App Deployment

### Projekt erstellen

Alle Applikationen in OpenShift werden in Projekten organisiert. In einem Projekt können viele Applikationen enthalten sein, sie befinden sich im gleichen _namespace_ und können miteinander über Services kommunizieren.

Als erstes erstellen wir ein Projekt **hello** über die OpenShift CLI. Damit wir mit den Projektnamen nicht durcheinanderkommen, stellt jeder vor den Projektnamen seinen Usernamen, also z.B. **user123-hello**.

### Applikation bauen und deployen

In unserem neuen Projekt deployen wir eine fertige nodejs Anwendung über OpenShift Source-to-Image (s2i). Über `oc new-app -h` kann die Hilfe aufgerufen werden, wie eine Applikation aus einem Git repository von OpenShift gebaut und deployed werden kann.

Die Applikation:
* liegt in Git unter folgender Adresse:  
https://github.com/nikolaus-lemberski/openshift-modul3
* dort im Unterordner (context directory) _hello-world_
* nutzt nodejs in der Version 16, z.B. mit baseimage 16-ubi8 oder 16-ubi8-minimal  
Hinweis: es muss kein Dockerfile erstellt werden!
* als build strategy soll _source_ verwendet werden

Über `oc get all` kann alles, was der `oc new-app` command erstellt hat, angesehen werden. Es werden zwei pods gebaut, erst ein "build" pods der die Anwendung baut, danach der pod mit der Anwendung.

**Zusatzaufgaben:** 

* Den Build Log verfolgen
* Eine shell im container der app öffnen und mit curl den app root öffnen
* Die Applikation in der Web Konsole, Developer Perspektive untersuchen

### Applikation öffentlich aufrufbar machen

Zuletzt erstellen wir eine _route_ für die app, um diese öffentlich aufrufbar zu machen, und testen (z.B. mit curl), ob die Anwendung erreichbar ist.

### Projekt löschen

Um Ressourcen für weitere Projekte freizugeben, löschen wir das Projekt wieder.


## 2 - App Deployment mit Fehlersuche
    - Projekt erstellen
    - Deployen einer bestehenden app mit fertigem image und Deployment file. Falsch gesetzte ports auf die health checks. 
    - Herausfinden was das Problem ist und im Deployment file die ports auf die health checks korrigieren
    - Projekt löschen

## 3 - Helm
    - Projekt erstellen
    - Erstellen eines helm charts für eine fertige Anwendung mit mariadb
    - Deployen des helm charts
    - Projekt löschen

## 4 - Service Mesh
    - Projekt erstellen
    - Projekt zur ServiceMeshMemberRoll hinzufügen
    - Vorhandenes Projekt (t.b.d.: Bookinfo, istio-tutorial, eigenes Projekt?) deployen
    - Kiali öffnen und Graph analysieren
    - Jaeger öffnen und traces analysieren
    - Projekt löschen
