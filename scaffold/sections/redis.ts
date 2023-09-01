import * as yaml from 'js-yaml';
import { resolve } from 'path';

import { replaceFile } from '../lib/replacer';
import { CacheConfig, GenChart, GenConstants, GenValues } from '../lib/cache';

function syncRedis(content: string) {
  const config = yaml.load(content) as {
    caches: CacheConfig;
  };

  const [slashStart, slashEnd] = [
    '//--scaffold cache start--',
    '//--scaffold cache end--',
  ];
  const [hexStart, hexEnd] = [
    '#--scaffold cache start--',
    '#--scaffold cache end--',
  ];

  // Do values file
  replaceFile(
    resolve(__dirname, '../../infra/root_chart/values.yaml'),
    hexStart,
    hexEnd,
    GenValues(config.caches),
  );

  // Do constants file
  replaceFile(
    resolve(__dirname, '../../src/constants.ts'),
    slashStart,
    slashEnd,
    GenConstants(config.caches),
  );

  // Do chart file
  replaceFile(
    resolve(__dirname, '../../infra/root_chart/Chart.yaml'),
    hexStart,
    hexEnd,
    GenChart(config.caches),
  );
}

export { syncRedis };
