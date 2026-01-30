# Gemini Project Context: f1-interactive-dashboard

This document provides context for the `f1-interactive-dashboard` project, an Angular-based web application.

## Project Overview

`f1-interactive-dashboard` is a real-time, interactive dashboard for watching Formula 1 streams with parallel data analysis. The application is built with Angular 20+ and utilizes `ngx-sse-client` to receive live data updates from a server-sent events (SSE) endpoint. The state of the application is managed using Angular Signals, providing a reactive and efficient user experience.

The core of the application is a dynamic, widget-based dashboard. Users can select from a set of predefined layouts to arrange widgets on the screen. The application also includes an administrative section for user management, although this feature is not yet fully implemented.

Key technologies used in this project include:
- **Angular 20+**: The core framework for the application.
- **Angular Material**: For UI components.
- **NG-MATERO**: A UI library based on Angular Material.
- **ngx-sse-client**: For handling Server-Sent Events (SSE).
- **Vitest**: For running unit tests.
- **ESLint** and **Prettier**: For code linting and formatting.

## Building and Running

### Prerequisites

- Node.js and npm

### Installation

To install the project dependencies, run the following command in the project's root directory:

```bash
npm install
```

### Development Server

To start the development server, run:

```bash
npm start
```

This will start a local development server at `http://localhost:4200/`. The application will automatically reload when source files are changed.

### Building

To build the project for production, run:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Running Unit Tests

To run the unit tests, use the following command:

```bash
npm test
```

## Development Conventions

### Coding Style

The project uses ESLint and Prettier to enforce a consistent coding style. Before committing any changes, it is recommended to run the following command to lint and format the code:

```bash
npm run lint
```

### Architecture

The application follows a standard Angular architecture with the following key components:

- **`src/app/core`**: Contains the core services, models, and interceptors for the application.
  - **`live.service.ts`**: Manages the real-time data connection using SSE and updates the application state.
  - **`layouts-service.ts`**: Manages the available dashboard layouts.
  - **`widget-factory.ts`**: A registry for the available widgets.
- **`src/app/routes`**: Contains the different routes of the application, such as the dashboard, admin section, and session pages.
- **`src/app/shared`**: Contains shared components, directives, and pipes that are used throughout the application.
- **`src/app/theme`**: Contains the theming and layout components for the application.
- **`public`**: Contains static assets such as images, fonts, and data files.

### State Management

The application uses Angular Signals for state management. The `live.service.ts` and its `StateHandler` are responsible for managing the application's state and providing reactive updates to the components.

### Layouts and Widgets

The dashboard layouts and widgets are currently hardcoded in the `layouts-service.ts` and `widget-factory.ts` respectively. To add a new layout or widget, you need to modify these files.

### Additional Coding Preferences
- Keep project dependencies minimal
- Use styles already defined in project
- Use relative imports and NOT a path alias
- Use apostrophes for strings declarations
- Start npm run lint after code generation
