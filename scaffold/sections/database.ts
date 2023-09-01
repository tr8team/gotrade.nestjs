import * as yaml from 'js-yaml';
import { resolve } from 'path';
import {
  DBConfig,
  GenChart,
  GenConstants,
  GenTaskfile,
  GenValues,
} from '../lib/db';
import { replaceFile } from '../lib/replacer';

function syncDatabase(content: string) {
  const config = yaml.load(content) as {
    databases: DBConfig;
  };

  const [slashStart, slashEnd] = [
    '//--scaffold database start--',
    '//--scaffold database end--',
  ];
  const [hexStart, hexEnd] = [
    '#--scaffold database start--',
    '#--scaffold database end--',
  ];

  // Do values file
  replaceFile(
    resolve(__dirname, '../../infra/root_chart/values.yaml'),
    hexStart,
    hexEnd,
    GenValues(config.databases),
  );

  // Do constants file
  replaceFile(
    resolve(__dirname, '../../src/constants.ts'),
    slashStart,
    slashEnd,
    GenConstants(config.databases),
  );

  // Do chart file
  replaceFile(
    resolve(__dirname, '../../infra/root_chart/Chart.yaml'),
    hexStart,
    hexEnd,
    GenChart(config.databases),
  );

  // Do Taskfile
  replaceFile(
    resolve(__dirname, '../../Taskfile.orm.yml'),
    hexStart,
    hexEnd,
    GenTaskfile(config.databases),
  );
}

export { syncDatabase };
