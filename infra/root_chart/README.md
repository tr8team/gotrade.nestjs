# gotrade-nestjs-root

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.16.0](https://img.shields.io/badge/AppVersion-1.16.0-informational?style=flat-square)

A Helm chart for Kubernetes

## Requirements

| Repository | Name | Version |
|------------|------|---------|
| file://../api_chart | api(gotrade-nestjs-api) | 0.1.0 |
| file://../migration_chart | migration(gotrade-nestjs-migration) | 0.1.0 |
| file://../test_chart | test(gotrade-nestjs-test) | 0.1.0 |
| oci://ghcr.io/dragonflydb/dragonfly/helm | maincache(dragonfly) | v1.8.0 |
| oci://registry-1.docker.io/bitnamicharts | mainstorage(minio) | 12.7.0 |
| oci://registry-1.docker.io/bitnamicharts | commentdb(mysql) | 9.10.10 |
| oci://registry-1.docker.io/bitnamicharts | maindb(postgresql) | 12.5.5 |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| api.affinity | object | `{}` |  |
| api.autoscaling.enabled | bool | `false` |  |
| api.autoscaling.maxReplicas | int | `100` |  |
| api.autoscaling.minReplicas | int | `3` |  |
| api.autoscaling.targetCPUUtilizationPercentage | int | `80` |  |
| api.autoscaling.targetMemoryUtilizationPercentage | int | `80` |  |
| api.config.mode | string | `"app"` |  |
| api.envFromSecret | string | `"gotrade-nestjs-secrets"` |  |
| api.image.pullPolicy | string | `"IfNotPresent"` |  |
| api.image.repository | string | `"gotrade-nestjs-template-api"` |  |
| api.image.tag | string | `""` |  |
| api.imagePullSecrets[0].name | string | `"regcred"` |  |
| api.ingress.annotations | object | `{}` |  |
| api.ingress.className | string | `"traefik"` |  |
| api.ingress.enabled | bool | `true` |  |
| api.ingress.hosts[0].host | string | `"api.nestjs.gotrade.local.lvh.me"` |  |
| api.ingress.hosts[0].paths[0].path | string | `"/"` |  |
| api.ingress.hosts[0].paths[0].pathType | string | `"ImplementationSpecific"` |  |
| api.ingress.tls[0].hosts[0] | string | `"api.nestjs.gotrade.local.lvh.me"` |  |
| api.ingress.tls[0].issuerRef | string | `"sample"` |  |
| api.ingress.tls[0].secretName | string | `"host"` |  |
| api.livenessProbe.httpGet.path | string | `"/"` |  |
| api.livenessProbe.httpGet.port | string | `"http"` |  |
| api.livenessProbe.initialDelaySeconds | int | `5` |  |
| api.mountConfig | bool | `false` |  |
| api.nodeSelector | object | `{}` |  |
| api.podAnnotations | object | `{}` |  |
| api.podSecurityContext | object | `{}` |  |
| api.readinessProbe.httpGet.path | string | `"/"` |  |
| api.readinessProbe.httpGet.port | string | `"http"` |  |
| api.readinessProbe.initialDelaySeconds | int | `5` |  |
| api.replicaCount | int | `1` |  |
| api.resources.limits.cpu | int | `1` |  |
| api.resources.limits.memory | string | `"1Gi"` |  |
| api.resources.requests.cpu | string | `"100m"` |  |
| api.resources.requests.memory | string | `"128Mi"` |  |
| api.securityContext | object | `{}` |  |
| api.service.containerPort | int | `3000` |  |
| api.service.port | int | `80` |  |
| api.service.type | string | `"ClusterIP"` |  |
| api.serviceAccount.annotations | object | `{}` |  |
| api.serviceAccount.create | bool | `false` |  |
| api.serviceAccount.name | string | `""` |  |
| api.serviceTree.<<.landscape | string | `"develop"` |  |
| api.serviceTree.<<.layer | string | `"2"` |  |
| api.serviceTree.<<.platform | string | `"gotrade"` |  |
| api.serviceTree.<<.service | string | `"nestjs"` |  |
| api.serviceTree.<<.team | string | `"PBG"` |  |
| api.serviceTree.designation | string | `"api"` |  |
| api.tolerations | list | `[]` |  |
| commentdb.architecture | string | `"standalone"` |  |
| commentdb.auth.database | string | `"comment"` |  |
| commentdb.auth.password | string | `"supersecret"` |  |
| commentdb.auth.username | string | `"admin"` |  |
| commentdb.enable | bool | `false` |  |
| commentdb.nameOverride | string | `"comment-database"` |  |
| commentdb.primary.persistence.enabled | bool | `false` |  |
| commentdb.primary.persistence.size | string | `"8Gi"` |  |
| maincache.enable | bool | `false` |  |
| maincache.extraArgs[0] | string | `"--requirepass=supersecret"` |  |
| maincache.nameOverride | string | `"main-cache"` |  |
| maincache.storage.enabled | bool | `false` |  |
| maindb.architecture | string | `"standalone"` |  |
| maindb.auth.database | string | `"main"` |  |
| maindb.auth.password | string | `"supersecret"` |  |
| maindb.auth.username | string | `"admin"` |  |
| maindb.enable | bool | `false` |  |
| maindb.nameOverride | string | `"main-database"` |  |
| maindb.primary.persistence.enabled | bool | `false` |  |
| maindb.primary.persistence.size | string | `"8Gi"` |  |
| mainstorage.auth.rootPassword | string | `"supersecret"` |  |
| mainstorage.auth.rootUser | string | `"admin"` |  |
| mainstorage.enable | bool | `false` |  |
| mainstorage.nameOverride | string | `"main-storage"` |  |
| mainstorage.persistence.enabled | bool | `false` |  |
| mainstorage.persistence.size | string | `"10Gi"` |  |
| migration.affinity | object | `{}` |  |
| migration.command[0] | string | `"node"` |  |
| migration.command[1] | string | `"dist/src/migrate"` |  |
| migration.config.mode | string | `"migration"` |  |
| migration.envFromSecret | string | `"gotrade-nestjs-secrets"` |  |
| migration.image.pullPolicy | string | `"IfNotPresent"` |  |
| migration.image.repository | string | `"gotrade-nestjs-migration"` |  |
| migration.image.tag | string | `""` |  |
| migration.imagePullSecrets | list | `[]` |  |
| migration.mountConfig | bool | `true` |  |
| migration.nodeSelector | object | `{}` |  |
| migration.podAnnotations | object | `{}` |  |
| migration.podSecurityContext | object | `{}` |  |
| migration.resources.limits.cpu | int | `2` |  |
| migration.resources.limits.memory | string | `"4Gi"` |  |
| migration.resources.requests.cpu | int | `1` |  |
| migration.resources.requests.memory | string | `"2Gi"` |  |
| migration.securityContext | object | `{}` |  |
| migration.serviceAccount.annotations | object | `{}` |  |
| migration.serviceAccount.create | bool | `false` |  |
| migration.serviceAccount.name | string | `""` |  |
| migration.serviceTree.<<.landscape | string | `"develop"` |  |
| migration.serviceTree.<<.layer | string | `"2"` |  |
| migration.serviceTree.<<.platform | string | `"gotrade"` |  |
| migration.serviceTree.<<.service | string | `"nestjs"` |  |
| migration.serviceTree.<<.team | string | `"PBG"` |  |
| migration.serviceTree.designation | string | `"migration"` |  |
| migration.tolerations | list | `[]` |  |
| secret.doppler.enable | bool | `false` |  |
| secret.fake.enable | bool | `false` |  |
| secret.name | string | `"gotrade-nestjs-secrets"` |  |
| serviceTree.landscape | string | `"develop"` |  |
| serviceTree.layer | string | `"2"` |  |
| serviceTree.platform | string | `"gotrade"` |  |
| serviceTree.service | string | `"nestjs"` |  |
| serviceTree.team | string | `"PBG"` |  |
| tags.active | bool | `true` |  |
| tags.local | bool | `true` |  |
| test.affinity | object | `{}` |  |
| test.command[0] | string | `"vitest"` |  |
| test.command[1] | string | `"run"` |  |
| test.command[2] | string | `"--config"` |  |
| test.command[3] | string | `"./config/test/vitest.int.report.config.ts"` |  |
| test.config.mode | string | `"app"` |  |
| test.envFromSecret | string | `"gotrade-nestjs-secrets"` |  |
| test.image.pullPolicy | string | `"IfNotPresent"` |  |
| test.image.repository | string | `"gotrade-nestjs-test"` |  |
| test.image.tag | string | `""` |  |
| test.imagePullSecrets | list | `[]` |  |
| test.mode | string | `"pod"` |  |
| test.mountConfig | bool | `true` |  |
| test.nodeSelector | object | `{}` |  |
| test.podAnnotations | object | `{}` |  |
| test.podSecurityContext | object | `{}` |  |
| test.resources.limits.cpu | int | `2` |  |
| test.resources.limits.memory | string | `"4Gi"` |  |
| test.resources.requests.cpu | string | `"200m"` |  |
| test.resources.requests.memory | string | `"256Mi"` |  |
| test.securityContext | object | `{}` |  |
| test.serviceAccount.annotations | object | `{}` |  |
| test.serviceAccount.create | bool | `false` |  |
| test.serviceAccount.name | string | `""` |  |
| test.serviceTree.<<.landscape | string | `"develop"` |  |
| test.serviceTree.<<.layer | string | `"2"` |  |
| test.serviceTree.<<.platform | string | `"gotrade"` |  |
| test.serviceTree.<<.service | string | `"nestjs"` |  |
| test.serviceTree.<<.team | string | `"PBG"` |  |
| test.serviceTree.designation | string | `"test"` |  |
| test.tolerations | list | `[]` |  |
| test.volume.enable | bool | `false` |  |

----------------------------------------------
Autogenerated from chart metadata using [helm-docs v1.11.0](https://github.com/norwoodj/helm-docs/releases/v1.11.0)
