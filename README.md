# Overview

## f1-interactive
f1-interactive is a real-time, interactive dashboard for watching Formula 1 streams with parallel data analysis. The core of the application is a dynamic, widget-based dashboard. Users can select a predefined layout or create it's own to arrange widgets on the screen.

## TechStack
The application is built with Angular 20+ and utilizes ngx-sse-client to receive live data updates from a server-sent events (SSE) endpoint. The state of the application is managed using Angular Signals. Backend server is built with java and provides livetiming data, auth and api endpoints.

