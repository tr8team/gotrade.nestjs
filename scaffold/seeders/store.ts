function generateStoreSeeder(name: string): [string, string] {
  const s = `import { IStorageSeeder } from '../../StorageSeeder';
import { StorageService } from '../../../src/infra/services/storage.service';

class StoreSeeder implements IStorageSeeder {
  async seed(client: StorageService): Promise<void> {
    client.listObjects();
  }
}

export { StoreSeeder };
`;

  return [`./seeders/storage/${name}/StoreSeeder.ts`, s];
}

export { generateStoreSeeder };
