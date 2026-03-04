#!/bin/sh
set -e

# Replace placeholders of the form __VAR_NAME__ in SQL files before database initialization.
# List variable names (space-separated) in SUBSTITUTE_VARS, e.g.:
# SUBSTITUTE_VARS="DB_NAME DB_USER"

if [ -n "$SUBSTITUTE_VARS" ]; then
  for var in $SUBSTITUTE_VARS; do
    val=$(printenv "$var")
    if [ -n "$val" ]; then
      echo "Replacing __${var}__ in /docker-entrypoint-initdb.d"
      find /docker-entrypoint-initdb.d -type f -name "*.sql*" -exec sed -i "s|__${var}__|${val}|g" {} +
    fi
  done
fi

# Exec the original official postgres entrypoint with all args
exec /usr/local/bin/docker-entrypoint.sh "$@"
