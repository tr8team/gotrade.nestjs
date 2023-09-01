import { Migration } from '@mikro-orm/migrations';

export class Migration20230808084542 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "blogs" alter column "likes" type int using ("likes"::int);',
    );
    this.addSql('alter table "blogs" alter column "likes" set default 0;');
    this.addSql('alter table "blogs" alter column "likes" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "blogs" alter column "likes" drop default;');
    this.addSql(
      'alter table "blogs" alter column "likes" type int using ("likes"::int);',
    );
    this.addSql('alter table "blogs" alter column "likes" set not null;');
  }
}
