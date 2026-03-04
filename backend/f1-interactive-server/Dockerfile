FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the packaged jar into the image. The CI builds it before docker build.
COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]
