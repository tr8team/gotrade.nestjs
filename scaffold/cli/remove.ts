import * as path from 'path';
import { removeFile } from '../lib/replacer';

function remove() {
  const [slashStart, slashEnd] = ['//--remove start--', '//--remove end--'];

  removeFile(
    path.resolve(__dirname, '../../src/config/root.config.ts'),
    slashStart,
    slashEnd,
  );
  removeFile(
    path.resolve(__dirname, '../../src/app.module.ts'),
    slashStart,
    slashEnd,
  );
}

export { remove };
