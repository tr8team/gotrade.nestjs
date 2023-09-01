import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { RootConfig } from './root.config';
import { merge, set } from 'lodash';

type RawConfig = { [s: string]: RawConfig | any };

const ENV_PREFIX = 'GT_' as const;
const ENV_DELIMITER = '__' as const;

function loadEnvironment(env: Record<string, string | undefined>): RawConfig {
  return Object.keys(env)
    .filter(key => key.startsWith(ENV_PREFIX))
    .map(k => {
      const value = env[k];
      const keyWithoutPrefix = k.replace(ENV_PREFIX, '');
      const key = keyWithoutPrefix
        .split(ENV_DELIMITER)
        .map(x => x.toLowerCase())
        .join('.');
      return { key, value };
    })
    .reduce((a, { key, value }) => set(a, key, value), {});
}

export default () => {
  const configPaths = ['config.yaml'];

  if (process.env.LANDSCAPE)
    configPaths.push(`${process.env.LANDSCAPE}.config.yaml`);

  const configs = configPaths.map(path => {
    try {
      const content = readFileSync(
        resolve(__dirname, '../../config/app', path),
        'utf8',
      );
      return yaml.load(content) as RawConfig;
    } catch {
      return {};
    }
  });

  // Load all environment with GT prefix and merge them into config
  const envConfig = loadEnvironment(process.env ?? {});
  configs.push(envConfig);

  const config = configs.reduce((a, b) => merge(a, b), {});

  const validatedConfig = plainToInstance(RootConfig, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return { ...validatedConfig };
};
