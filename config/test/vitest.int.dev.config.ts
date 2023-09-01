import { defineConfig } from 'vitest/config';
import { merge } from 'lodash';
import { baseConfig, devConfig, integrationTest } from './base.config';

const config = merge(baseConfig, integrationTest, devConfig);

export default defineConfig(config);
