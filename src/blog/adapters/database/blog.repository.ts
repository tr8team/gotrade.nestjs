import { IBlogRepository } from '../../domain/blog.repository';
import { BlogPrincipal, BlogRecord } from '../../domain/models/blog.model';
import { EntityManager } from '@mikro-orm/core';
import { BlogDataMapper } from './blog.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { contexts } from '../../../constants';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { BlogEntity } from './entities/main/blog.entity';

@Injectable()
class BlogRepository implements IBlogRepository {
  constructor(
    @InjectEntityManager(contexts.MAIN)
    private readonly db: EntityManager,
    @Inject(BlogDataMapper)
    private readonly mapper: BlogDataMapper,
  ) {}

  async create(blog: BlogRecord): Promise<BlogPrincipal> {
    const data = this.mapper.fromRecord(blog);
    this.db.create(BlogEntity, data);
    this.db.persist(data);
    await this.db.flush();
    return this.mapper.toPrincipal(data);
  }

  async delete(id: string): Promise<void> {
    const blog = this.db.getReference(BlogEntity, id);
    await this.db.remove(blog).flush();
  }

  async get(id: string): Promise<BlogPrincipal | null> {
    const blog = await this.db.findOne(BlogEntity, id);
    if (!blog) {
      return null;
    }
    return this.mapper.toPrincipal(blog);
  }

  async search(
    search?: string,
    limit?: number,
    skip?: number,
  ): Promise<BlogPrincipal[]> {
    const r = await this.db.find(
      BlogEntity,
      search == null
        ? {}
        : {
            text: { $like: `%${search}%` },
          },
      { limit, offset: skip },
    );
    return r.map(x => this.mapper.toPrincipal(x));
  }

  async update(id: string, blog: BlogRecord): Promise<BlogPrincipal> {
    const v2 = this.mapper.fromRecord(blog);
    const v1 = this.db.getReference(BlogEntity, id);
    Object.assign(v1, v2);
    await this.db.flush();
    return this.mapper.toPrincipal(v1);
  }
}

export { BlogRepository };
