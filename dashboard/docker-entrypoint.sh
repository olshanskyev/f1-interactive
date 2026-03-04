#!/bin/sh
set -e

# Substitute variables listed in SUBSTITUTE_VARS (space-separated variable names)
# Placeholders in built files should use the form __VAR_NAME__ (double underscores)
if [ -n "$SUBSTITUTE_VARS" ]; then
  for var in $SUBSTITUTE_VARS; do
    val=$(printenv "$var")
    if [ -n "$val" ]; then
      echo "Replacing __${var}__ in /usr/share/nginx/html"
      find /usr/share/nginx/html -type f -exec sed -i "s|__${var}__|${val}|g" {} +
    fi
  done
fi

# Start nginx in foreground
nginx -g 'daemon off;'
