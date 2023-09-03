# <% projectName %>

{{ .Env.BADGES }} ![badge](https://img.shields.io/badge/{{ .Env.VERSION }}-blue)

<% desc %>

This README should not be edited, please edit `README.TPL.MD` instead.

# Stack

- [Nix](https://nixos.org/): Environment Management
- [direnv](https://direnv.net/): Environment Loader
- [Taskfile](https://taskfile.dev/): Task runner
- [Nest.js](https://nestjs.com/): API Server
- [MikroORM](https://mikro-orm.io/): ORM
- [Vitest](https://vitest.dev/): Test framework
- Dependabot: Dependency Linter
- Doppler: SecretOps
- [Semantic Releaser](https://semantic-release.gitbook.io/semantic-release/usage/configuration)
  with [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/): Continuous Delivery
- Infrastructure
    - [K3D](https://k3d.io/v5.5.2/): Local and test clusters
    - [kubectl](https://kubernetes.io/docs/reference/kubectl/): Kubernetes CLI
    - [helm](https://www.google.com/search?q=helm&sourceid=chrome&ie=UTF-8): Application Packaging
    - [mirrord](https://mirrord.dev/): Local forwarding
    - [tilt](https://tilt.dev/): Local workflow development
- Linters
    - [ES Lint](https://eslint.org/)
    - [shellcheck](https://www.shellcheck.net/)
    - [gitlint](https://jorisroovers.com/gitlint/)
    - [hadolint](https://github.com/hadolint/hadolint)
- Formatters
    - [shfmt](https://github.com/mvdan/sh)
    - [prettier](https://prettier.io/)
    - [nixpkgs-fmt](https://github.com/nix-community/nixpkgs-fmt)
- [Pre-commit](https://pre-commit.com/)



## Pre-requisite

All dependencies are pre-install via `nix` and activated via `direnv`

- [Nix](https://nixos.org/) > 2.12.0
- [direnv](https://direnv.net/) > 2.23.2
- [Docker](https://hub.docker.com/)

## Get Started

Setup the repository. This is automatically executed if you have `direnv`

```
pls setup
```

Running unit tests

```
pls test
```

## Development

The task runner has convenience commands for development

| Action                                      | Command         |
|---------------------------------------------|-----------------|
| Setup the repository                        | `pls setup`     |
| Start development                           | `pls dev`       |
| Build typescript project                    | `pls build`     |
| Clean all artifacts                         | `pls clean`     |
| Preview the built project locally           | `pls preview`   |
| Remove all development artifacts in cluster | `pls stop:dev`  |
| Remove all test artifacts in cluster        | `pls stop:test` |
| Tear development cluster                    | `pls tear:dev`  | 
| Tear test cluster                           | `pls tear:test` |

## Testing

The task runner has convenience commands for testing

| Action                    | Command               | Alias            |
|---------------------------|-----------------------|------------------|
| Run unit test             | `pls test:unit`       | `pls test`       |
| Watch unit test           | `pls test:unit:watch` | `pls test:watch` |
| Unit Test Coverage        | `pls test:unit:cover` | `-`              |
| Run integration test      | `pls test:int`        | `-`              |
| Watch integration test    | `pls test:int:watch`  | `-`              |
| Integration Test Coverage | `pls test:int:cover`  | `-`              |
| Generate Test Reports     | `pls test:report`     | `-`              |

You can additionally filter tests by adding the filter (contains):

```bash
pls test:int -- fast
```

The above will only run test file names containing the word `fast`

You can check `Taskfile.yml` and `tasks` folder for more commands.

## Infrastructure

The task runner has convenience commands for docker and helm charts.

Please note that helm chart commands are scoped to `landscapes`, i.e. there
are the same command for each landscape.

| Action                                                     | Command                        |
|------------------------------------------------------------|--------------------------------|
| Debug the chart                                            | `pls helm:<landscape>:debug`   |
| Update dependency                                          | `pls helm:<landscape>:dep`     |
| Install/Upgrade the chart in current context and namespace | `pls helm:<landscape>:install` |
| Synchronize config file with helm chart                    | `pls helm:<landscape>:sync`    |
| Uninstall the chart                                        | `pls helm:<landscape>:remove`  |
| Build production docker image                              | `pls docker:prod`              |
| Build development docker image                             | `pls docker:dev`               |
| Build test docker image                                    | `pls docker:test`              |
| Build migration docker image                               | `pls docker:migrate`           |

## Databases

The task runner has convenience commands for ORM to manage the databases.

Please note that orm commands are scoped to database names, i.e. there
are the same command for each database name.

There are multiple database commands, please check `Taskfile.yml` and `tasks` folder for more commands.
The one listed here are the most common commands.

| Action            | Command                               |
|-------------------|---------------------------------------|
| Debug ORM         | `pls orm:<database>:debug`            |
| Migrate           | `pls orm:<database>:migration:up`     |
| Create Migration  | `pls orm:<database>:migration:create` |
| Run seeders       | `pls orm:<database>:seeder:run`       |
| Create new seeder | `pls orm:<database>:seeder:create`    |
|                   |                                       |

## Quality Assurance

The task runner has convenience commands for basic quality assurance

| Action         | Command     |
|----------------|-------------|
| Run all Checks | `pls check` |

You can check `Taskfile.yml` and `tasks` folder for more commands.
