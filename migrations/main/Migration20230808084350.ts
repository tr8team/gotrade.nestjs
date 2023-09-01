import { Migration } from '@mikro-orm/migrations';

export class Migration20230808084350 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "blogs" add column "likes" int not null;');
  }
}
