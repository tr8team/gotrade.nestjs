import { BlogPrincipal, BlogRecord } from './models/blog.model';

interface IBlogRepository {
  search(
    search?: string,
    limit?: number,
    skip?: number,
  ): Promise<BlogPrincipal[]>;

  get(id: string): Promise<BlogPrincipal | null>;

  create(blog: BlogRecord): Promise<BlogPrincipal>;

  update(id: string, blog: BlogRecord): Promise<BlogPrincipal>;

  delete(id: string): Promise<void>;
}

export type { IBlogRepository };
