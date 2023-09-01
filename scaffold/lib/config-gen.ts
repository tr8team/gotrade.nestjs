import { EtaConfig } from 'eta/dist/types/config';
import * as path from 'path';
import { Eta } from 'eta';
import * as os from 'os';

export type ConfigType = 'base' | 'local' | 'prod' | 'prod-local';

export function indentString(input: string, spaces: number = 4): string {
  const indent = ' '.repeat(spaces);
  return input
    .split(os.EOL)
    .map(line => indent + line)
    .join(os.EOL);
}

export class ConfigGen {
  constructor(
    private readonly config: Partial<EtaConfig>,
    private readonly mysql: { [s: string]: boolean },
    private readonly postgres: { [s: string]: boolean },
    private readonly redis: { [s: string]: boolean },
    private readonly store: { [s: string]: boolean },
  ) {}

  private get templates(): string {
    return path.resolve(__dirname, `../templates/landscape/`);
  }

  public renderValues(
    baseVars: any,
    landscape: string,
    enable: boolean,
  ): [string, string] {
    const eta = new Eta({
      views: path.resolve(this.templates, 'infra/values'),
      ...this.config,
    });

    // load redis
    const caches = Object.keys(this.redis)
      .map(
        x => `${x}cache:
  enable: ${enable}`,
      )
      .join(os.EOL);

    const mysql = Object.keys(this.mysql).map(
      x => `${x}db:
  enable: ${enable}`,
    );

    const postgres = Object.keys(this.postgres).map(
      x => `${x}db:
  enable: ${enable}`,
    );

    const databases = [...mysql, ...postgres].join(os.EOL);

    const storages = Object.keys(this.store)
      .map(
        x => `${x}storage:
  enable: ${enable}`,
      )
      .join(os.EOL);

    const r = eta.render(`values.${landscape}.yaml`, {
      ...baseVars,
      landscape,
      databases,
      caches,
      storages,
    });
    return [`./infra/root_chart/values.${landscape}.yaml`, r];
  }

  public renderConfig(
    baseVars: any,
    landscape: string,
    type: ConfigType,
  ): [string, string] {
    const eta = new Eta({
      views: path.resolve(this.templates, 'config/app', type),
      ...this.config,
    });
    // load redis
    const redises = Object.entries(this.redis)
      .map(([x, auto]) =>
        eta.render('./cache.partial.yaml', {
          ...baseVars,
          landscape,
          name: x,
          auto: !auto,
        }),
      )
      .map(x => indentString(x, 2));
    // load store
    const stores = Object.entries(this.store)
      .map(([x, auto]) =>
        eta.render('./store.partial.yaml', {
          ...baseVars,
          landscape,
          name: x,
          auto: !auto,
        }),
      )
      .map(x => indentString(x, 2));
    // load mysql
    const mysqls = Object.entries(this.mysql)
      .map(([x, auto]) =>
        eta.render('./database.partial.yaml', {
          ...baseVars,
          landscape,
          name: x,
          auto: !auto,
          driver: `  driverOptions:
    connection:
      ssl:
        rejectUnauthorized: true
`,
        }),
      )
      .map(x => indentString(x, 2));
    // load postgres
    const postgreses = Object.entries(this.postgres)
      .map(([x, auto]) =>
        eta.render('./database.partial.yaml', {
          ...baseVars,
          landscape,
          name: x,
          auto: !auto,
          driver: `  driverOptions:
    connection:
      ssl: true
`,
        }),
      )
      .map(x => indentString(x, 2));

    let databases = [...mysqls, ...postgreses];
    let caches = redises;
    let storages = stores;

    databases = databases.length === 0 ? ['{}'] : databases;
    caches = caches.length === 0 ? ['{}'] : caches;
    storages = storages.length === 0 ? ['{}'] : storages;

    const r = eta.render('./config.yaml', {
      ...baseVars,
      landscape,
      databases: databases.join(os.EOL),
      caches: caches.join(os.EOL),
      storages: storages.join(os.EOL),
    });

    return [
      `./config/app/${landscape === '' ? '' : `${landscape}.`}config.yaml`,
      r,
    ];
  }

  public renderTerraform(baseVars: any, landscape: string): [string, string] {
    const eta = new Eta({
      views: path.resolve(this.templates, 'terraform'),
      ...this.config,
    });

    const caches = Object.entries(this.redis)
      .filter(([, v]) => !v)
      .map(
        ([name]) => `    ${name} = {
      autoscale = true
    }`,
      )
      .join(os.EOL);

    const storages = Object.entries(this.store)
      .filter(([, v]) => !v)
      .map(
        ([name]) => `    ${name} = {
      additional_tags = {}
    }`,
      )
      .join(os.EOL);

    const mysqls = Object.entries(this.mysql)
      .filter(([, v]) => !v)
      .map(([name]) => `    ${name} = {}`)
      .join(os.EOL);

    const postgresqls = Object.entries(this.postgres)
      .filter(([, v]) => !v)
      .map(([name]) => `    ${name} = {}`)
      .join(os.EOL);

    const r = eta.render(`landscape.tf`, {
      ...baseVars,
      landscape: landscape.split('-').join('_'),
      mysqls,
      postgresqls,
      caches,
      storages,
    });

    return [`./terraform/${landscape}.tf`, r];
  }
}
