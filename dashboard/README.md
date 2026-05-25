# F1Interactive Dashboard

Dashboard (frontend) for f1 interactive project

## Project Setup
This project is build using angular and [ng-matero](https://github.com/ng-matero/ng-matero) template. To get it running on your local machine, follow these steps:

### 1. Install Dependencies

First, navigate to the project directory in your terminal and install the required Node.js packages.

```bash
npm install
```

### 2. Run the Development Server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `https://localhost`. The application will automatically reload whenever you modify any of the source files.

To start dashboard without server (with cached data), run:
```bash
npm run start:standalone
```

## 3. Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## 4. Running unit tests

To execute unit tests, use the following command:

```bash
npm test
```

or for testing specified spec file:

```bash
npm run test:include <path_to_spec_file>
```

## 5. Linting

To start source code linting:

```bash
npm run lint
```
