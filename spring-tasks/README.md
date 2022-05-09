# Spring Tasks

Demo Spring Applikation zur Verwaltung von Tasks. Läuft mit einer embedded Datenbank, sofern keine Datenbank-Zugangsdaten übergeben werden.

Der base path ist _/api_ und kann per _curl_ aufgerufen werden. Bei Aufruf im Browser wird ein HAL-Explorer geöffnet, der die Interaktion mit dem REST service ermöglicht.  

## Produktiv-Datenbank

Die Datenbank-Zugangsdaten können über Umgebungsvariablen wie folgt übergeben werden:  

* SPRING_DATASOURCE_DRIVER_CLASS_NAME  
org.mariadb.jdbc.Driver
* SPRING_DATASOURCE_URL  
jdbc:mariadb://<database-service-url>:3306/<database-name>
* SPRING_DATASOURCE_USERNAME  
<database-username>
* SPRING_DATASOURCE_PASSWORD
<database-password>