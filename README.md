<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./dashboard/public/favicon.svg" width="200">
    <img alt="f1interactive" src="./dashboard/public/favicon.svg" width="200">
  </picture>
</p>
<a href="https://f1interactive.net"><h1 align="center">F1 Interactive dashboard</h1></a>

## F1 Interactive
[f1-interactive](https://f1interactive.net) is a real-time dashboard designed for Formula 1 fans who want to combine live streams with deep data analysis. Built on a dynamic, widget-based architecture, the app allows users to choose from predefined layouts or build a fully custom workspace to suit their viewing style.

## TechStack
The application is built with Angular 20+ and utilizes ngx-sse-client to receive live data updates from a server-sent events (SSE) endpoint. The state of the application is managed using Angular Signals. Backend server is built with java and provides livetiming data, auth and api endpoints.

## Supporting
If you'd like to support this project, you can [buy me a coffee](https://www.buymeacoffee.com/olshanskyev).

## Contributing
Always welcome.
Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) to learn how to contribute and [`SETUP.md`](SETUP.md) to setup f1interactive on your local machine for development.

#### Acknowledgments
Partial logic for track map display and f1 calendar parsing inspired by [f1-dash](https://github.com/slowlydev/f1-dash).