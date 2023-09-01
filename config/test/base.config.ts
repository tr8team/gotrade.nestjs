import { UserConfig } from 'vite';

const baseConfig: UserConfig = {
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    testTimeout: 30000,
    threads: false,
    isolate: true,
    unstubEnvs: true,
    coverage: {
      all: true,
      provider: 'istanbul',
    },
  },
};
const unitTest: UserConfig = {
  test: {
    name: 'Unit Test',
    dir: 'tests/unit',
    threads: true,
    coverage: {
      include: [
        'src/**/domain/**/*.?([mc])[tj]s?(x)',
        'src/**/adapters/**/*.mapper.?([mc])[tj]s?(x)',
      ],
    },
  },
};

const integrationTest: UserConfig = {
  test: {
    name: 'Integration Test',
    dir: 'tests/integration',
    coverage: {
      include: ['src/**/*.?([mc])[tj]s?(x)'],
      exclude: [
        'src/infra/**/*.?([mc])[tj]s?(x)',
        'src/auth/**/*.?([mc])[tj]s?(x)',
        'src/config/**/*.?([mc])[tj]s?(x)',
        'src/*.?([mc])[tj]s?(x)',
      ],
    },
  },
};

const devConfig: UserConfig = {
  test: {
    reporters: ['default'],
    coverage: {
      reporter: ['text'],
    },
  },
};

const reportConfig = (base: string): UserConfig => ({
  test: {
    reporters: ['basic', 'html', 'json'],
    outputFile: {
      html: `test-results/${base}/html/index.html`,
      json: `test-results/${base}/result.json`,
    },
    coverage: {
      reporter: ['text-summary', 'html', 'json-summary'],
      reportsDirectory: `./test-results/${base}/coverage`,
    },
  },
});

export { baseConfig, unitTest, integrationTest, devConfig, reportConfig };
