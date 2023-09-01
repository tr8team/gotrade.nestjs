import { Inject, Injectable } from '@nestjs/common';
import {
  Comment,
  CommentPrincipal,
  CommentRecord,
} from './models/comment.model';
import { ICommentRepository } from './comment.repository';
import { CommentRepository } from '../adapters/database/comment.repository';
import { BlogRepository } from '../adapters/database/blog.repository';
import { IBlogRepository } from './blog.repository';

interface ICommentService {
  search(
    search?: string,
    limit?: number,
    skip?: number,
    blogId?: string,
  ): Promise<CommentPrincipal[]>;

  get(blogId: string, id: string): Promise<Comment | null>;

  create(blogId: string, comment: CommentRecord): Promise<CommentPrincipal>;

  update(
    blogId: string,
    id: string,
    comment: CommentRecord,
  ): Promise<CommentPrincipal>;

  delete(blogId: string, id: string): Promise<void>;
}

@Injectable()
class CommentService implements ICommentService {
  constructor(
    @Inject(CommentRepository) private readonly repo: ICommentRepository,
    @Inject(BlogRepository) private readonly blogRepo: IBlogRepository,
  ) {}

  create(blogId: string, comment: CommentRecord): Promise<CommentPrincipal> {
    return this.repo.create(blogId, comment);
  }

  delete(blogId: string, id: string): Promise<void> {
    return this.repo.delete(blogId, id);
  }

  async get(blogId: string, id: string): Promise<Comment | null> {
    const blog = await this.blogRepo.get(blogId);
    if (blog == null) return blog;
    const comment = await this.repo.get(blogId, id);
    if (comment == null) return comment;
    return new Comment(comment, blog);
  }

  search(
    search?: string,
    limit?: number,
    skip?: number,
    blogId?: string,
  ): Promise<CommentPrincipal[]> {
    return this.repo.search(search, limit, skip, blogId);
  }

  update(
    blogId: string,
    id: string,
    comment: CommentRecord,
  ): Promise<CommentPrincipal> {
    return this.repo.update(blogId, id, comment);
  }
}

export { CommentService };
export type { ICommentService };
