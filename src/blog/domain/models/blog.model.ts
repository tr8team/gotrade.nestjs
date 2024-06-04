class Blog {
  constructor(readonly principal: BlogPrincipal) {}
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
