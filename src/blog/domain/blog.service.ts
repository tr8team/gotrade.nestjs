import { Inject, Injectable } from '@nestjs/common';
import { Blog, BlogPrincipal, BlogRecord } from './models/blog.model';
import { IBlogRepository } from './blog.repository';
import { BlogRepository } from '../adapters/database/blog.repository';

interface IBlogService {
  search(
    search?: string,
    limit?: number,
    skip?: number,
  ): Promise<BlogPrincipal[]>;

  get(id: string): Promise<Blog | null>;

  create(blog: BlogRecord): Promise<BlogPrincipal>;

  update(id: string, blog: BlogRecord): Promise<BlogPrincipal>;

  delete(id: string): Promise<void>;
}

@Injectable()
class BlogService implements IBlogService {
  constructor(@Inject(BlogRepository) private readonly repo: IBlogRepository) {}

  create(blog: BlogRecord): Promise<BlogPrincipal> {
    return this.repo.create(blog);
  }

  delete(id: string): Promise<void> {
    return this.repo.delete(id);
  }

  async get(id: string): Promise<Blog | null> {
    const blog = await this.repo.get(id);
    if (blog == null) return blog;

    return new Blog(blog);
  }

  search(
    search?: string,
    limit?: number,
    skip?: number,
  ): Promise<BlogPrincipal[]> {
    return this.repo.search(search, limit, skip);
  }

  update(id: string, blog: BlogRecord): Promise<BlogPrincipal> {
    return this.repo.update(id, blog);
  }
}

export { BlogService };
export type { IBlogService };
