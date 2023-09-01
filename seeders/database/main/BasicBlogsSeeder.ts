import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BlogEntity } from '../../../src/blog/adapters/database/entities/main/blog.entity';

export class BasicBlogsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const blog = new BlogEntity();
    blog.id = '52c6a5ee-55be-493b-9b87-2a951d5632f2';
    blog.text = "I'm a blog post!";
    blog.tags = JSON.stringify(['blog', 'post']);
    await em.upsert(blog);
  }
}
