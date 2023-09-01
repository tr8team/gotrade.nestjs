import { Migration } from '@mikro-orm/migrations';

export class Migration20230808033843 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `comments` (`id` varchar(36) not null, `created_at` datetime not null, `updated_at` datetime not null, `blog_id` varchar(255) not null, `text` varchar(255) not null, `likes` int not null, `dislikes` int not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;',
    );
  }
}
