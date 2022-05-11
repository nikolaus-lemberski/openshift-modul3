## 3 - Helm | SOLUTION

## Projekt erstellen

`oc new-project <username>-helmapp`

## Helm Chart erstellen

`helm create tasks`

In _values.yml_ am Anfang den _image_ Eintrag wie folgt aktualisieren:

```yaml
image:
  repository: quay.io/nlembers/spring-tasks
  pullPolicy: IfNotPresent
  tag: "v1.1"
```

Im gleichen file ganz unten hinzufügen:

```yaml
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

## Helm Chart anwenden

```sh
helm dependency update  
helm install tasks .
```

## Projekt löschen

`oc delete project <username>-helmapp`