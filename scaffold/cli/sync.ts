import * as chalk from 'chalk';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { syncDatabase } from '../sections/database';
import { syncRedis } from '../sections/redis';
import { syncStore } from '../sections/storage';

function sync() {
  console.log('🔄 Syncing databases, caches and stores');
  const content = readFileSync(
    resolve(__dirname, '../../config/app', 'config.yaml'),
    'utf8',
  );

  syncDatabase(content);
  console.info(chalk.green('Synced databases'));
  console.info();

  syncRedis(content);
  console.info(chalk.green('Synced caches'));
  console.info();

  syncStore(content);
  console.info(chalk.green('Synced stores'));
  console.info();
  console.log('✅ Sync complete');
}

export { sync };
