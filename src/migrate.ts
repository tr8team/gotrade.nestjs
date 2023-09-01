import 'reflect-metadata';
import './infra/tracing';

import { migrate, wait } from './bootstrap';
import * as process from 'process';
wait()
  .then(() => migrate())
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
