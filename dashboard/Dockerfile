FROM node:24-alpine AS build
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY . .

# Install dependencies and build the production bundle
RUN npm ci --silent && npm run build

FROM nginx:stable-alpine

# Add bash for the entrypoint script
RUN apk add --no-cache bash

# Copy built app (Angular output path)
# The app's production build is located at dist/f1-interactive-dashboard/browser
COPY --from=build /app/dist/f1-interactive-dashboard/browser /usr/share/nginx/html

# Entrypoint that substitutes placeholders with env vars at container start
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
