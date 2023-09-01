import { CommentPrincipal, CommentRecord } from './models/comment.model';

interface ICommentRepository {
  search(
    search?: string,
    limit?: number,
    skip?: number,
    blogId?: string,
  ): Promise<CommentPrincipal[]>;

  get(blogId: string, id: string): Promise<CommentPrincipal | null>;

  create(blogId: string, comment: CommentRecord): Promise<CommentPrincipal>;

  update(
    blogId: string,
    id: string,
    comment: CommentRecord,
  ): Promise<CommentPrincipal>;

  delete(blogId: string, id: string): Promise<void>;
}

export type { ICommentRepository };
