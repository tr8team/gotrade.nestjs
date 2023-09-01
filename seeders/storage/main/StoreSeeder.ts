import { IStorageSeeder } from '../../StorageSeeder';
import { StorageService } from '../../../src/infra/services/storage.service';
import * as fs from 'fs';
import * as path from 'path';

class StoreSeeder implements IStorageSeeder {
  async seed(client: StorageService): Promise<void> {
    const file = fs.readFileSync(path.resolve(__dirname, './photo.jpeg'));
    await client.putObject('test', file);
  }
}

export { StoreSeeder };
