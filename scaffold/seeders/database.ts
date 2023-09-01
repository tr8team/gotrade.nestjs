function generateDatabaseSeeder(name: string): [string, string] {
  const s = `import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return await this.call(em, []);
  }
}`;

  return [`./seeders/database/${name}/DatabaseSeeder.ts`, s];
}

export { generateDatabaseSeeder };
