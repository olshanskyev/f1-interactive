# Setup Components

A short tutorial on how to run f1interactive via docker.

## Run with docker compose

create .env file with variables
```
cp .env.example .env
```

run docker compose
```
docker compose up -d
```

restart all containers:
```
docker compose restart
```

recreate all containers with new env. Does not remove volumes
```
docker compose up -d --force-recreate
```

check running containers and logs
```
docker compose ps
docker compose logs -f
docker compose logs -f server
```


## Run every component with docker

### dashboard

Techstack: angular, TypeSecript, nginx

The website/dashboard itself. Gets data from api and live service.

run docker image
```
docker run -d -p 80:80 \
  -e SUBSTITUTE_VARS="BASE_URL BASE_URL_SIMULATOR HOST CERT_PATH" \
  -e BASE_URL="<BASE_URL>" \
  -e BASE_URL_SIMULATOR="OPTIONAL_BASE_URL_SIMULATOR" \
  -e HOST="<host>" \
  -e CERT_PATH="<cert_path/>" \
  --name f1-dashboard \
  ghcr.io/olshanskyev/f1-interactive-dashboard:latest
```

Comments:
Simulator can be used only by admins for testing sessions saved by backend/tools/f1-interactive-sniffer

### backend/f1-interactive_db

Techstack: postgres

DB for server.

run docker image
```
docker run -d --network f1interactive-net \
  -e SUBSTITUTE_VARS="POSTGRES_USER DATABASE_NAME DATABASE_SCHEMA ADMIN_PWD" \
  -e POSTGRES_USER="<DB_USER>" \
  -e POSTGRES_PASSWORD="<DB_USER_PASSWORD>" \
  -e DATABASE_NAME="<DATABASE_NAME>" \
  -e DATABASE_SCHEMA="<DATABASE_SCHEMA>" \
  -e ADMIN_PWD="<BCrypt_ENCRYPTED_PWD>" \
  --name f1-interactive-db \
  ghcr.io/olshanskyev/f1-interactive-db:latest
```

Comments:
ADMIN_PWD in form $2a$10$ipNTzBJBP5QQtewb6oPr/OWItptAuz/Rf7dcQEEFY5Gqpo39VIK2u
Can be generated here: https://bcrypt-generator.com/
ToDo: insert not fully correct?, manually db field update might be necessary

### backend/f1-interactive-server

Techstack: Java, SignalRCore

Connects to f1 over signalrcore and serves live data over sse to dashboard.

run docker image
```
docker run -d --network f1interactive-net -p 8080:8080 \
  -e DATABASE_HOST="f1-interactive-db" \
  -e DATABASE_PORT="5432" \
  -e DATABASE_NAME="<DATABASE_NAME>" \
  -e DATABASE_SCHEMA="<DATABASE_SCHEMA>" \
  -e DATABASE_USER="<DB_USER>" \
  -e DATABASE_PASSWORD="<DB_USER_PASSWORD>" \
  -e MAX_POOL_SIZE="3" \
  -e ALLOWED_ORIGIN_PATTERNS="<ALLOWED_ORIGIN>" \
  --name f1-interactive-server \
  ghcr.io/olshanskyev/f1-interactive-server:latest
```

Comments:
ALLOWED_ORIGIN_PATTERNS f.e. "http://localhost:4200"

### tools

Techstack: java

f1-interactive-sniffer - connects to f1 livetiming service and saves all events

run
```
java -Dformula1AccessToken=<token> -Dhttps.proxyHost=<proxy> -Dhttps.proxyPort=<proxy_port> \
-jar ./f1-interactive-sniffer/target/f1-interactive-sniffer.jar <out_file>
```

f1-interactive-simulator - reads events that are saved by sniffer. Conrol from dashboard by Admin user

run
```
java -jar ./f1-interactive-simulator/target/f1-interactive-simulator.jar
```

