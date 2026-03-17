FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the packaged jar(s) into the image.
# This copies the server jar and any optional tools (simulator, sniffer)
# built into the target folder by CI.
COPY target/*.jar /app/

EXPOSE 8080 8081

ENTRYPOINT ["sh", "-c", "java -jar /app/f1-interactive-server*.jar"]
