FROM postgres:15-alpine

# Install bash to allow substitution script
RUN apk add --no-cache bash

WORKDIR /docker-entrypoint-initdb.d

# Copy initialization SQL files (sql-scripts) into the init directory
# Expect SQL scripts under ./sql-scripts in the build context
COPY ./sql-scripts /docker-entrypoint-initdb.d

# Copy our entrypoint wrapper that will substitute placeholders then exec the official entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 5432

# Our wrapper will perform substitutions and then exec the original postgres entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["postgres"]
