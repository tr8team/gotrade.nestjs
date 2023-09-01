import 'reflect-metadata';
import './infra/tracing';

import { bootstrap, migrate, wait } from './bootstrap';

async function start() {
  await wait();
  await migrate();
  const [app, host] = await bootstrap();
  await app.listen(host.port, host.host);
}

start().then();
