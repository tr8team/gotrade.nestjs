import { BlogPrincipal } from './blog.model';

class Comment {
  constructor(
    readonly principal: CommentPrincipal,
    readonly blog: BlogPrincipal,
  ) {}
}

class CommentPrincipal {
  constructor(
    readonly id: string,
    readonly record: CommentRecord,
  ) {}
}

class CommentRecord {
  constructor(
    readonly text: string,
    readonly likes: number,
    readonly dislikes: number,
  ) {}
}

export { CommentPrincipal, CommentRecord, Comment };
