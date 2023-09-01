import { defineConfig } from 'vitest/config';
import { merge } from 'lodash';
import { baseConfig, integrationTest, reportConfig } from './base.config';

const config = merge(baseConfig, integrationTest, reportConfig('int'));

export default defineConfig(config);
