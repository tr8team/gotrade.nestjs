import load from '../src/config/loader';
import { defineConfig } from '@mikro-orm/core';
import * as process from 'process';

const config = load();

const db = process.env.GT_DATABASE;

const {
  orm,
  connection: { database, ...conn },
  driverOptions,
} = config.databases[db!];

const c = JSON.parse(JSON.stringify({ ...orm, ...conn }));

export default defineConfig({
  dbName: database,
  ...c,
  driverOptions,
});
