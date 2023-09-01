const CACHE_VERSION = 'v1.8.0';

type CacheConfig = {
  [key: string]: any;
};

function genChartYaml(name: string) {
  return `  - name: dragonfly
    version: ${CACHE_VERSION}
    repository: oci://ghcr.io/dragonflydb/dragonfly/helm
    alias: ${name}cache
    condition: ${name}cache.enable`;
}

function getCacheValues(name: string) {
  return `${name}cache:
  enable: false
  nameOverride: "${name}-cache"
  storage:
    enabled: false
  extraArgs:
    - --requirepass=supersecret`;
}
function genContext(name: string) {
  return `  ${name.toUpperCase()}: Symbol('${name}'),`;
}

function genOrmModule(name: string) {
  return `  RedisModule.register('${name}', redis),`;
}

function GenChart(config: CacheConfig) {
  let newContent = '';
  for (const [k] of Object.entries(config)) {
    newContent += genChartYaml(k) + '\n';
  }
  return newContent;
}

function GenConstants(config: CacheConfig) {
  let context = '';
  let orm = '';
  for (const [k] of Object.entries(config)) {
    context += genContext(k) + '\n';
    orm += genOrmModule(k) + '\n';
  }
  context = context.trim();
  orm = orm.trim();
  return `const redis = {
  ${context}
} as const;

const redisModules = [
  ${orm}
] as const;`;
}

function GenValues(config: CacheConfig) {
  let values = '';
  for (const [k] of Object.entries(config)) {
    values += getCacheValues(k) + '\n';
  }
  return values;
}

export { CacheConfig, GenChart, GenConstants, GenValues };
