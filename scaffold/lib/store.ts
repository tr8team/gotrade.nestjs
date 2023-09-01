const STORAGE_VERSION = '12.7.0';

type StoreConfig = {
  [key: string]: any;
};

function genChartYaml(name: string) {
  return `  - name: minio
    version: ${STORAGE_VERSION}
    repository: oci://registry-1.docker.io/bitnamicharts
    alias: ${name}storage
    condition: ${name}storage.enable`;
}

function getStoreValues(name: string) {
  return `${name}storage:
  enable: false
  nameOverride: "${name}-storage"
  persistence:
    enabled: false
    size: 10Gi
  auth:
    rootUser: admin
    rootPassword: supersecret`;
}
function genContext(name: string) {
  return `  ${name.toUpperCase()}: Symbol('${name}'),`;
}

function genOrmModule(name: string) {
  return `  StorageModule.register('${name}', stores),`;
}

function GenChart(config: StoreConfig) {
  let newContent = '';
  for (const [k] of Object.entries(config)) {
    newContent += genChartYaml(k) + '\n';
  }
  return newContent;
}

function GenConstants(config: StoreConfig) {
  let context = '';
  let orm = '';
  for (const [k] of Object.entries(config)) {
    context += genContext(k) + '\n';
    orm += genOrmModule(k) + '\n';
  }
  context = context.trim();
  orm = orm.trim();
  return `const stores = {
  ${context}
} as const;

const storeModules = [
  ${orm}
] as const;`;
}

function GenValues(config: StoreConfig) {
  let values = '';
  for (const [k] of Object.entries(config)) {
    values += getStoreValues(k) + '\n';
  }
  return values;
}

export { StoreConfig, GenChart, GenConstants, GenValues };
