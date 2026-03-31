# How to contribute

## Setup

The easiest way to start all the components is to use docker-compose: [SETUP](SETUP.md).<br>
To start dashboard in developer mode: [INSTRUCTIONS](.github/instructions/dashboard.instructions.md).<br>
Backend should be installed and started together with dashboard. DB instance is not strictly necessary.

## Branching Convention

For branch names the git flow style branching is used.

For new features: `feature/the-name-of-the-feature`<br>
For a bugfix or refactor: `bugfix/a-title-for-the-bugfix`<br>

These feature and bugfix branches should be based off `dev` and be merged into `dev`.

## Commit Convention

For the commit message please use conventional commits:
[https://www.conventionalcommits.org/en/v1.0.0/](https://www.conventionalcommits.org/en/v1.0.0/)

### A Quick TL;DR; Of Conventional Commits

- `feat` When adding a new feature
- `fix` When fixing something
- `refactor` When it's neither a fix or a new feature
- `perf` If the change improves performance
- `chore` Anything else (should be last resort)

## Before opening a Pull Request

Please test your code, build the parts of the application you touched. For example, if you made changes in the frontend, make sure to run `npm build` and see if the build succeeds.

Before pushing do not forget to start: `npm test` and `npm run lint`

When opening a Pull Request please select `dev` as the target branch.