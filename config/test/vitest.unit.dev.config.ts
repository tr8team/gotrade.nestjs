import { defineConfig } from 'vitest/config';
import { merge } from 'lodash';
import { baseConfig, devConfig, unitTest } from './base.config';

const config = merge(baseConfig, unitTest, devConfig);

export default defineConfig(config);
