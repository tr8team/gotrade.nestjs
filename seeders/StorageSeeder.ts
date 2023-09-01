import { StorageService } from '../src/infra/services/storage.service';

interface IStorageSeeder {
  seed(client: StorageService): Promise<void>;
}

export type { IStorageSeeder };
