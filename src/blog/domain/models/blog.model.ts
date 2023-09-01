import { CommentPrincipal } from './comment.model';

class Blog {
  constructor(
    readonly principal: BlogPrincipal,
    readonly comments: CommentPrincipal[],
  ) {}
}

class BlogPrincipal {
  constructor(
    readonly id: string,
    readonly record: BlogRecord,
  ) {}
}

class BlogRecord {
  constructor(
    readonly text: string,
    readonly tags: string[],
  ) {}
}

export { Blog, BlogRecord, BlogPrincipal };
