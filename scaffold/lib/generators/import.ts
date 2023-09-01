import { ImportModel } from './interface';
import { Kore } from '@kirinnee/core';
import * as os from 'os';

const core = new Kore();
core.ExtendPrimitives();

export function processImport(imports: ImportModel[]): string {
  const i = imports.Unique(true);
  const def = i
    .Where(x => x.mode === 'default')
    .map(x => `import ${x.name} from '${x.from}';`);
  const single = i
    .Where(x => x.mode === '*')
    .map(x => `import * as ${x.name} from '${x.from}';`);

  const flat: { [s: string]: string[] } = {};

  const multi = i.Where(x => x.mode === 'multi');
  for (const m of multi) {
    if (flat[m.from] == null) flat[m.from] = [];
    flat[m.from].push(m.name);
  }

  const multiImport = Object.entries(flat).map(
    ([from, names]) => `import { ${names.join(', ')} } from '${from}';`,
  );

  return [...def, ...single, ...multiImport].join(os.EOL);
}
