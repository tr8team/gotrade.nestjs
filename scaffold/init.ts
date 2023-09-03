import { Eta } from 'eta';
import * as path from 'path';
import { globSync } from 'glob';
import { EtaConfig } from 'eta/dist/types/config';
import { checkbox, confirm, input, select } from '@inquirer/prompts';
import { ConfigGen, ConfigType } from './lib/config-gen';
import * as write from 'write';
import { generateDatabaseSeeder } from './seeders/database';
import { generateCacheSeeder } from './seeders/cache';
import { generateStoreSeeder } from './seeders/store';
import { remove } from './cli/remove';
import { sync } from './cli/sync';
import * as os from 'os';
import * as del from 'del';
import * as execa from 'execa';
import * as process from 'process';
import validator from 'validator';
import * as chalk from 'chalk';
import axios from 'axios';

const templateFolder = path.resolve(__dirname, './templates/init');

const etaConfig: Partial<EtaConfig> = {
  parse: {
    exec: '=',
    interpolate: '',
    raw: '~',
  },
  useWith: true,
  autoTrim: false,
};

async function run(s: string, arg: string[]) {
  const p = execa(s, arg);
  p.stdout?.pipe(process.stdout);
  p.stderr?.pipe(process.stderr);
  await p;
}

function terraformLandscapes(landscapes: string[]): string {
  return landscapes
    .map(
      l =>
        `    (local.landscapes.${l
          .split('-')
          .join('_')}.slug)    = local.landscapes.${l
          .split('-')
          .join('_')}.name`,
    )
    .join(os.EOL);
}

const init = new Eta({
  views: templateFolder,
  ...etaConfig,
});

const landscapeToType = (landscape: string): { t: ConfigType; e: boolean } => {
  switch (landscape) {
    case '':
      return { t: 'base', e: false };
    case 'ci':
    case 'test':
    case 'local':
      return { t: 'local', e: true };
    case 'local-prod':
      return { t: 'prod-local', e: true };
    case 'staging':
    case 'admin':
    case 'prod-indo':
      return { t: 'prod', e: false };
    default:
      throw new Error(`Unknown landscape ${landscape}`);
  }
};

function createLoopQuestion(
  type: string,
  set: string[],
): () => Promise<{ [s: string]: boolean }> {
  return async function (): Promise<{ [s: string]: boolean }> {
    const ret: { [s: string]: boolean } = {};
    let cont = true;
    while (cont) {
      const name = await input({
        message: `Enter ${type} name`,
        validate: v => validator.isAlpha(v) && v.length > 0 && !set.includes(v),
      });

      const answer = await confirm({
        message: `Is this an existing ${type}?`,
        default: false,
      });
      ret[name] = answer;
      set.push(name);
      cont = await confirm({
        message: `Add more ${type}?`,
        default: false,
      });
    }
    return ret;
  };
}

const db: string[] = [];
const redis: string[] = [];
const storage: string[] = [];

const askRedis = createLoopQuestion('redis', redis);
const askMysql = createLoopQuestion('MySQL', db);
const askPostgres = createLoopQuestion('PostgreSQL', db);
const askStore = createLoopQuestion('S3 Bucket', storage);

async function start(): Promise<[string, string]> {
  const reqPlatform = await axios.get(
    'https://api.jetty.systems.admin.tr8.tech/api/v1/platform',
  );

  const platforms = reqPlatform.data as {
    name: string;
    slug: string;
    description: string;
  }[];

  const platform = await select({
    message: 'Platform',
    choices: platforms.map(({ name, slug, description }) => ({
      name,
      value: slug,
      description,
    })),
  });
  const service = (
    await input({
      message: 'Service Name:',
      validate: v => validator.isAlpha(v) && v.length > 0,
    })
  ).toLowerCase();
  const p = platform;
  const s = service;
  const projectName = `${p.charAt(0).toUpperCase()}${p.slice(1)} ${s
    .charAt(0)
    .toUpperCase()}${s.slice(1)}`;
  const desc = await input({
    message: 'Description:',
    validate: v => v.length > 0,
  });
  const team = await select({
    message: 'Team',
    choices: [
      {
        name: 'ESD',
        value: 'esd',
        description: 'Systems Team',
      },
      {
        name: 'PBG',
        value: 'pbg',
        description: 'Product Team',
      },
      {
        name: 'PBC',
        value: 'pbc',
        description: 'Integration Team',
      },
      {
        name: 'Data',
        value: 'data',
        description: 'Data/AI Team',
      },
    ],
  });

  const unitError = await input({
    message: 'Minimum Unit Test Coverage %',
    validate: x => !!x.match(/^\d+$/),
    default: '95',
  });

  const unitErr = parseInt(unitError);
  const unitWarn = Math.min(unitErr + 5, 100);

  const intError = await input({
    message: 'Minimum Integration Test Coverage %',
    validate: x => !!x.match(/^\d+$/),
    default: '95',
  });

  const intErr = parseInt(intError);
  const intWarn = Math.min(intErr + 5, 100);

  const latestPortRes = await axios.get(
    'https://api.jetty.systems.admin.tr8.tech/api/v1/service/latest',
  );

  const latestPort = latestPortRes.data as {
    devPort: number;
    testPort: number;
    localPort: number;
  };

  const vars = {
    projectName,
    desc,
    platform,
    service,
    port: {
      local: `${latestPort.localPort}`,
      dev: `${latestPort.devPort}`,
      test: `${latestPort.testPort}`,
    },
    team,
    test: {
      unit: {
        warn: unitWarn,
        error: unitErr,
      },
      int: {
        warn: intWarn,
        error: intErr,
      },
    },
  };
  const reqLandscape = await axios.get(
    'https://api.jetty.systems.admin.tr8.tech/api/v1/landscape',
  );
  const landscapesOpt = reqLandscape.data as {
    name: string;
    slug: string;
    description: string;
  }[];
  // ask for all landscapes
  const prodLandscapes = await checkbox({
    message: 'Select landscapes that apply',
    choices: landscapesOpt.map(({ name, slug }) => ({
      name,
      value: slug,
      checked: false,
    })),
  });

  const landscapes = ['ci', 'local', 'local-prod', 'test', ...prodLandscapes];

  // gather dependencies
  const dependencies = await checkbox({
    message: 'Select dependencies you need',
    choices: [
      {
        name: 'Redis',
        value: 'redis',
      },
      {
        name: 'MySQL',
        value: 'mysql',
      },
      {
        name: 'PostgreSQL',
        value: 'postgres',
      },
      {
        name: 'S3',
        value: 'storage',
      },
    ],
  });
  let redis: { [s: string]: boolean } = {};
  let mysql: { [s: string]: boolean } = {};
  let postgres: { [s: string]: boolean } = {};
  let store: { [s: string]: boolean } = {};

  for (const dep of dependencies) {
    if (dep === 'redis') {
      redis = await askRedis();
      continue;
    }
    if (dep === 'mysql') {
      mysql = await askMysql();
      continue;
    }
    if (dep === 'postgres') {
      postgres = await askPostgres();
      continue;
    }
    if (dep === 'storage') {
      store = await askStore();
      continue;
    }
  }

  const templates = globSync([
    `${templateFolder}/**/*.*`,
    `${templateFolder}/**/.*/**/*.*`,
  ])
    .map(x => x.replace(templateFolder, '.'))
    .map(x => [
      x,
      init.render(x, {
        ...vars,
        landscapes: terraformLandscapes(landscapes),
      }),
    ]);

  const seeders = [
    ...Object.keys(mysql).map(x => generateDatabaseSeeder(x)),
    ...Object.keys(postgres).map(x => generateDatabaseSeeder(x)),
    ...Object.keys(redis).map(x => generateCacheSeeder(x)),
    ...Object.keys(store).map(x => generateStoreSeeder(x)),
  ];

  const migrations = [...Object.keys(mysql), ...Object.keys(postgres)].map(
    x => [`./migrations/${x}/.gitkeep`, ''],
  );

  const gen = new ConfigGen(etaConfig, mysql, postgres, redis, store);

  const configs = landscapes
    .concat('')
    .map(x => gen.renderConfig(vars, x, landscapeToType(x).t));
  const values = landscapes.map(x =>
    gen.renderValues(vars, x, landscapeToType(x).e),
  );

  const tf = prodLandscapes.map(x => gen.renderTerraform(vars, x));

  const files = [
    ...configs,
    ...values,
    ...templates,
    ...seeders,
    ...tf,
    ...migrations,
  ];
  console.info('🎯 Local Port:', vars.port.local);
  console.info('🎯 Dev Port:', vars.port.dev);
  console.info('🎯 Test Port:', vars.port.test);
  console.info('🛎️ Service Name:', vars.service);
  console.info('🛎️ Service Slug:', vars.service.toLowerCase());
  console.info('🛎️ Service Description:', vars.desc);

  const c = await confirm({ message: 'Confirm?' });

  if (!c) {
    console.info('🚨 User aborted');
    process.exit(0);
  }

  const all = files.map(async ([p, value]) => {
    console.info('Writing', p);
    await write(path.resolve(__dirname, '..', p), value);
    console.info('✅ Write Completed', p);
  });
  await Promise.all(all);
  console.info('Rendered all values');

  console.info('⬆️ Updating Jetty...');
  const jettyRes = await axios.post(
    'https://api.jetty.systems.admin.tr8.tech/api/v1/service',
    {
      name: vars.service,
      slug: vars.service.toLowerCase(),
      description: vars.desc,
      localPort: parseInt(vars.port.local),
      devPort: parseInt(vars.port.dev),
      testPort: parseInt(vars.port.test),
    },
  );

  if (jettyRes.status == 201) return [platform, service];
  console.info(
    chalk.bgRedBright('failed to update Jetty, please contact ESD team'),
  );
  return [platform, service];
}

async function main() {
  try {
    await Promise.all([
      del(path.resolve(__dirname, '../migrations')),
      del(path.resolve(__dirname, '../seeders/cache')),
      del(path.resolve(__dirname, '../seeders/database')),
      del(path.resolve(__dirname, '../seeders/storage')),
      del(path.resolve(__dirname, '../tests/integration/blog')),
      del(path.resolve(__dirname, '../tests/unit/blog')),
      del(path.resolve(__dirname, '../src/blog')),
      del(path.resolve(__dirname, '../config/app/*.config.yaml')),
      del(path.resolve(__dirname, '../infra/root_chart/*.yaml')),
      del(path.resolve(__dirname, '../ci.yaml')),
      del(path.resolve(__dirname, '../tests/controller.spec')),
      del(path.resolve(__dirname, '../person.yaml')),
      del(path.resolve(__dirname, '../pnpm-lock.yaml')),
    ]);
    const [platform, service] = await start();
    sync();
    remove();
    await run('helm', ['dependency', 'update', './infra/root_chart']);
    await run('pnpm', ['i', 'update', './infra/root_chart']);

    console.info('✅ Initialized repository');
    console.info('');
    console.info(
      chalk.bgBlueBright(
        `Copy terraform folder to 'gotrade-l2-infra' repository under new folder 'services/${platform}/${service}' and contact ESD team`,
      ),
    );
  } catch (e) {
    console.error(e);
    console.log('↪️ Reverting...');
    execa.sync('git', ['add', '.']);
    execa.sync('git', ['reset', '--hard']);
    console.info('✅ Reverted');
  } finally {
  }
}

main().then();
