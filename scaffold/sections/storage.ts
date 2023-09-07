import * as yaml from 'js-yaml';
import { resolve } from 'path';

import { replaceFile } from '../lib/replacer';
import { GenChart, GenConstants, GenValues, StoreConfig } from '../lib/store';

function syncStore(content: string) {
  const config = yaml.load(content) as {
    storages: StoreConfig;
  };

  const [slashStart, slashEnd] = [
    '//--scaffold storage start--',
    '//--scaffold storage end--',
  ];
  const [hexStart, hexEnd] = [
    '#--scaffold storage start--',
    '#--scaffold storage end--',
  ];

  // Do values file
  replaceFile(
    resolve(__dirname, '../../infra/root_chart/values.yaml'),
    hexStart,
    hexEnd,
    GenValues(config.storages),
  );

  // Do constants file
  replaceFile(
    resolve(__dirname, '../../src/constants.ts'),
    slashStart,
    slashEnd,
    GenConstants(config.storages),
  );

  // Do chart file
  replaceFile(
    resolve(__dirname, '../../infra/root_chart/Chart.yaml'),
    hexStart,
    hexEnd,
    GenChart(config.storages),
  );
}

export { syncStore };
