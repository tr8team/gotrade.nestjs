import * as execa from 'execa';
import { EtaConfig } from 'eta/dist/types/config';
import { Eta } from 'eta';
import * as path from 'path';
import { resolve } from 'path';
import { globSync } from 'glob';
import * as write from 'write';
import { AllGenerator, Field, Type } from './lib/fields';
import * as process from 'process';
import { confirm, input, select } from '@inquirer/prompts';
import * as fs from 'fs';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { DBConfig } from './lib/db';
import { simpleReplaceFile } from './lib/replacer';
import { NumberGen } from './lib/generators/number';
import { BooleanGen } from './lib/generators/boolean';
import { StringGen } from './lib/generators/string';
import { DateGen } from './lib/generators/date';
import { InstantGen } from './lib/generators/instant';
import { TimeGen } from './lib/generators/time';
import { UUIDGen } from './lib/generators/uuid';
import { UrlGen } from './lib/generators/url';
import { EmailGen } from './lib/generators/email';
import validator from 'validator';

const etaConfig: Partial<EtaConfig> = {
  autoEscape: false,
  parse: {
    exec: '=',
    interpolate: '',
    raw: '~',
  },
  useWith: true,
  autoTrim: false,
};

async function exec(c: string, arg: string[]) {
  const p = execa(c, arg);
  p.stdout?.pipe(process.stdout);
  p.stderr?.pipe(process.stderr);
  await p;
}

async function createModule(module: string) {
  await exec('nest', ['g', 'mo', module]);
}

async function genSrc(
  module: string,
  resource: string,
  nameUpper: string,
  dbName: string,
  vars: any,
) {
  const templateFolder = path.resolve(__dirname, 'templates/gen');
  const src = new Eta({
    ...etaConfig,
    views: templateFolder,
  });

  const files = globSync([
    `${templateFolder}/**/*.*`,
    `${templateFolder}/**/.*/**/*.*`,
  ])
    .map(x => [
      x.replace(templateFolder, `.`),
      x.replace(templateFolder, `./src/${module}`),
    ])
    .map(([read, write]) => [
      write
        .replace('.eta', '.ts')
        .replace('/sample.', '/' + resource + '.')
        .replace('database/entities/main', 'database/entities/' + dbName),
      src.render(read, {
        version: 1,
        dbName,
        nameUpper,
        name: resource,
        ...vars,
      }),
    ]);
  const all = files.map(async ([p, value]) => {
    console.info('Writing', p);
    await write(path.resolve(__dirname, '..', p), value);
    console.info('✅ Write Completed', p);
  });
  await Promise.all(all);

  simpleReplaceFile(
    path.resolve(__dirname, '..', 'src', module, `${module}.module.ts`),
    `import { ${nameUpper}Mapper } from './adapters/database/${resource}.mapper';`,
    `import { ${nameUpper}DataMapper } from './adapters/database/${resource}.mapper';`,
  );
  simpleReplaceFile(
    path.resolve(__dirname, '..', 'src', module, `${module}.module.ts`),
    `import { ${nameUpper}Mapper } from './adapters/api/v1/${resource}.mapper';`,
    `import { ${nameUpper}ApiV1Mapper } from './adapters/api/v1/${resource}.mapper';`,
  );

  simpleReplaceFile(
    path.resolve(__dirname, '..', 'src', module, `${module}.module.ts`),
    `${nameUpper}Mapper`,
    `${nameUpper}DataMapper, ${nameUpper}ApiV1Mapper`,
  );

  simpleReplaceFile(
    path.resolve(__dirname, '..', 'src', module, `${module}.module.ts`),
    `${nameUpper}Controller`,
    `${nameUpper}V1Controller`,
  );

  simpleReplaceFile(
    path.resolve(__dirname, '..', 'src', module, `${module}.module.ts`),
    `${nameUpper}Controller`,
    `${nameUpper}V1Controller`,
  );
}

async function genUnitTest(
  module: string,
  resource: string,
  nameUpper: string,
  dbName: string,
  vars: any,
) {
  const templateFolder = path.resolve(__dirname, 'templates/tests/unit/sample');
  const src = new Eta({
    ...etaConfig,
    views: templateFolder,
  });

  const files = globSync([
    `${templateFolder}/**/*.*`,
    `${templateFolder}/**/.*/**/*.*`,
  ])
    .map(x => [
      x.replace(templateFolder, `.`),
      x.replace(templateFolder, `./tests/unit/${module}`),
    ])
    .map(([read, write]) => [
      write
        .replace('.eta', '.ts')
        .replace(`${module}/person.`, `${module}/${resource}.`),
      src.render(read, {
        module,
        version: 1,
        dbName,
        nameUpper,
        name: resource,
        ...vars,
      }),
    ]);
  const all = files.map(async ([p, value]) => {
    console.info('Writing', p);
    await write(path.resolve(__dirname, '..', p), value);
    console.info('✅ Write Completed', p);
  });
  await Promise.all(all);
}

async function createResources(module: string, resource: string) {
  await exec('nest', [
    'g',
    '--flat',
    '--no-spec',
    'pr',
    `${module}/adapters/database/${resource}.mapper`,
  ]);

  await exec('nest', [
    'g',
    '--flat',
    '--no-spec',
    'pr',
    `${module}/adapters/api/v1/${resource}.mapper`,
  ]);

  await exec('nest', [
    'g',
    '--flat',
    '--no-spec',
    'pr',
    `${module}/adapters/database/${resource}.repository`,
  ]);

  await exec('nest', [
    'g',
    '--flat',
    '--no-spec',
    'pr',
    `${module}/domain/${resource}.service`,
  ]);

  await exec('nest', [
    'g',
    '--flat',
    '--no-spec',
    'co',
    `${module}/adapters/api/v1/${resource}`,
  ]);
}

async function updateResources(
  module: string,
  resource: string,
  field: Field[],
  dbName: string,
) {
  const allGen = new AllGenerator([
    new NumberGen(),
    new BooleanGen(),
    new StringGen(),
    new DateGen(),
    new InstantGen(),
    new TimeGen(),
    new UUIDGen(),
    new UrlGen(),
    new EmailGen(),
  ]);
  const nameUpper = resource.charAt(0).toUpperCase() + resource.slice(1);
  const vars = allGen.gen(field);

  await genSrc(module, resource, nameUpper, dbName, vars);
  await genUnitTest(module, resource, nameUpper, dbName, vars);
  //
}

async function getField(existing: string[]): Promise<[Field, boolean]> {
  const name = await input({
    message: 'Field Name',
    validate: v =>
      v.length > 0 && validator.isAlphanumeric(v) && !existing.includes(v),
  });
  const type: Type = (await select({
    message: 'Field Type',
    choices: [
      {
        name: 'Number',
        value: 'number',
        description: 'Javascript number',
      },
      {
        name: 'Boolean',
        value: 'boolean',
        description: 'Javascript boolean',
      },
      {
        name: 'String',
        value: 'string',
        description: 'Javascript string',
      },
      {
        name: 'Email',
        value: 'email',
        description: 'Javascript string with email validator',
      },
      {
        name: 'UUID',
        value: 'uuid',
        description: 'Javascript string with UUIDv4 validator',
      },
      {
        name: 'URL',
        value: 'url',
        description: 'Javascript string with URL validator',
      },
      {
        name: 'Instant',
        value: 'instant',
        description:
          'Javascript Temporal Proposal Instant (Specific point in time)',
      },
      {
        name: 'Date',
        value: 'date',
        description:
          'Javascript Temporal Proposal PlainDate (Date without time)',
      },
      {
        name: 'Time',
        value: 'time',
        description:
          'Javascript Temporal Proposal PlainTime (Time without date)',
      },
    ],
  })) as Type;
  const addMore = await confirm({ message: 'Add More?' });
  return [{ name, type }, addMore];
}

async function inquire() {
  let [module, resource] = process.argv.slice(2);

  console.info('Starting scaffold...');

  if (module == null) {
    module = await input({ message: 'Module name: ' });
  }
  if (resource == null) {
    resource = await input({ message: 'Resource name: ' });
  }

  console.info('📦 Module  : ', module);
  console.info('📦 Resource: ', resource);

  const content = readFileSync(
    resolve(__dirname, '../config/app', 'config.yaml'),
    'utf8',
  );

  const config = yaml.load(content) as {
    databases: DBConfig;
  };

  Object.entries(config.databases).map(([k]) => ({
    name: k,
    value: k,
  }));

  const db = await select({
    message: 'Choose database',
    choices: Object.entries(config.databases).map(([k]) => ({
      name: k,
      value: k,
    })),
  });

  const addFields: 'interactive' | 'file' | 'skip' = await select({
    message: 'Setup resource fields:',
    choices: [
      {
        name: 'Interactive Prompt',
        value: 'interactive',
        description: 'Use interactive prompt to setup fields',
      },
      {
        name: 'File',
        value: 'file',
        description: 'Use file with `field: type` format to setup fields',
      },
      {
        name: 'Skip',
        value: 'skip',
        description: 'Skip field setup',
      },
    ],
  });
  const fields: Field[] = [];
  if (addFields === 'interactive') {
    let cont = true;
    while (cont) {
      const [field, addMore] = await getField(fields.map(x => x.name));
      fields.push(field);
      cont = addMore;
    }
  } else if (addFields === 'file') {
    const fieldFile = await input({ message: 'Field file path: ' });
    const content: { [s: string]: string } = yaml.load(
      readFileSync(fieldFile, 'utf8'),
    ) as { [s: string]: string };
    const f = Object.entries(content).map(
      ([name, type]) =>
        ({
          name,
          type: type as Type,
        }) satisfies Field,
    );
    fields.push(...f);
  }

  if (!fs.existsSync(path.resolve('../src', module, `${module}.module.ts`)))
    await createModule(module);
  await createResources(module, resource);
  await updateResources(module, resource, fields, db);
}

inquire().then();
