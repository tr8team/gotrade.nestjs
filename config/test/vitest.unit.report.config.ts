import { defineConfig } from 'vitest/config';
import { merge } from 'lodash';
import { baseConfig, reportConfig, unitTest } from './base.config';

const config = merge(baseConfig, unitTest, reportConfig('unit'));
export default defineConfig(config);
