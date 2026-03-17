FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the packaged jar(s) into the image.
# This copies the server jar and any optional tools (simulator, sniffer)
# built into the target folder by CI.
COPY target/*.jar /app/
RUN find /app -maxdepth 1 -name "f1-interactive-server*.jar" -exec mv {} /app/app.jar \;

EXPOSE 8080 8081

ENTRYPOINT ["java","-jar","/app/app.jar"]
