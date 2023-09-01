import { Migration } from '@mikro-orm/migrations';

export class Migration20230808033822 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "blogs" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "text" varchar(255) not null, "tags" varchar(255) not null, constraint "blogs_pkey" primary key ("id"));',
    );
  }
}
