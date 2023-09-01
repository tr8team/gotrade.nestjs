const PG_VERSION = '12.5.5';
const MS_VERSION = '9.10.10';

type DBConfig = {
  [key: string]: {
    connection: {
      type: 'postgresql' | 'mysql';
    };
  };
};

function genChartYaml(name: string, type: 'postgresql' | 'mysql') {
  return `  - name: ${type === 'postgresql' ? 'postgresql' : 'mysql'}
    version: ${type === 'postgresql' ? PG_VERSION : MS_VERSION}
    repository: oci://registry-1.docker.io/bitnamicharts
    alias: ${name}db
    condition: ${name}db.enable`;
}

function genPostgresValues(name: string) {
  return `${name}db:
  enable: false
  nameOverride: "${name}-database"
  auth:
    username: "admin"
    password: "supersecret"
    database: "${name}"
  primary:
    persistence:
      enabled: false
      size: 8Gi
  architecture: standalone`;
}

function genMySQLValues(name: string) {
  return `${name}db:
  enable: false
  nameOverride: "${name}-database"
  auth:
    username: "admin"
    password: "supersecret"
    database: "${name}"
  primary:
    persistence:
      enabled: false
      size: 8Gi
  architecture: standalone`;
}

function genContext(name: string) {
  return `  ${name.toUpperCase()}: '${name}',`;
}

function genOrmModule(name: string) {
  return `  OrmModule.register(contexts.${name.toUpperCase()}),`;
}

function genTaskfile(name: string) {
  return `  ${name}:
    taskfile: tasks/Taskfile.orm.yml
    vars:
      GT_DATABASE: ${name}
`;
}

function GenChart(config: DBConfig) {
  let newContent = '';
  for (const [k, c] of Object.entries(config)) {
    newContent += genChartYaml(k, c.connection.type) + '\n';
  }
  return newContent;
}

function GenConstants(config: DBConfig) {
  let context = '';
  let orm = '';
  for (const [k] of Object.entries(config)) {
    context += genContext(k) + '\n';
    orm += genOrmModule(k) + '\n';
  }
  context = context.trim();
  orm = orm.trim();
  return `const contexts = {
  ${context}
} as const;

const dbModules = [
  ${orm}
] as const;`;
}

function GenValues(config: DBConfig) {
  let values = '';
  for (const [k, c] of Object.entries(config)) {
    if (c.connection.type === 'postgresql') {
      values += genPostgresValues(k) + '\n';
    } else {
      values += genMySQLValues(k) + '\n';
    }
  }
  return values;
}

function GenTaskfile(config: DBConfig) {
  let taskfile = '';
  for (const [k] of Object.entries(config)) {
    taskfile += genTaskfile(k) + '\n';
  }
  return taskfile;
}

export { DBConfig, GenChart, GenConstants, GenValues, GenTaskfile };
