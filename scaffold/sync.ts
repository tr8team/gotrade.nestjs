import { sync } from './cli/sync';
import * as chalk from 'chalk';

sync();

console.info(
  chalk.cyanBright(
    'Please ensure to update all config (`config/app/*.config.yaml`) and values (`infra/root_chart/*.values.yaml`) files.',
  ),
);
