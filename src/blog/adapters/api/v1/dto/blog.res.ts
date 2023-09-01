class BlogPrincipalRes {
  readonly id!: string;

  readonly text!: string;

  readonly tags!: string[];
}

class BlogRes {
  readonly principal!: BlogPrincipalRes;
}

export { BlogRes, BlogPrincipalRes };
