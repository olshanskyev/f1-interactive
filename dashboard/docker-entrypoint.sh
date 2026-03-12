#!/bin/sh
set -e

# Substitute variables listed in SUBSTITUTE_VARS (space-separated variable names)
# Placeholders in built files should use the form __VAR_NAME__ (double underscores)

# Handle Optional SSL Configuration
if [ -f /etc/nginx/conf.d/default.conf ]; then
  if [ -z "$CERT_PATH" ]; then
    echo "No CERT_PATH provided. Configuring Nginx for HTTP only."
    sed -i '/# HTTPS_REDIRECT_START/,/# HTTPS_REDIRECT_END/d' /etc/nginx/conf.d/default.conf
    sed -i '/# HTTPS_SERVER_START/,/# HTTPS_SERVER_END/d' /etc/nginx/conf.d/default.conf
  else
    echo "CERT_PATH provided. Configuring Nginx for HTTPS."
    sed -i '/# HTTP_ONLY_START/,/# HTTP_ONLY_END/d' /etc/nginx/conf.d/default.conf
  fi
fi

if [ -n "$SUBSTITUTE_VARS" ]; then
  for var in $SUBSTITUTE_VARS; do
    val=$(printenv "$var")
    if [ -n "$val" ]; then
      echo "Replacing __${var}__ in /usr/share/nginx/html"
      find /usr/share/nginx/html -type f -exec sed -i "s|__${var}__|${val}|g" {} +

      echo "Replacing __${var}__ in Nginx config /etc/nginx/conf.d/default.conf"
      if [ -f /etc/nginx/conf.d/default.conf ]; then
        sed -i "s|__${var}__|${val}|g" /etc/nginx/conf.d/default.conf
      fi
    fi
  done
fi

# Start nginx in foreground
nginx -g 'daemon off;'
