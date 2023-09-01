import { CreateBlogReq } from './dto/blog.req';
import {
  Blog,
  BlogPrincipal,
  BlogRecord,
} from '../../../domain/models/blog.model';
import { BlogPrincipalRes, BlogRes } from './dto/blog.res';
import { Injectable } from '@nestjs/common';

@Injectable()
class BlogApiV1Mapper {
  fromCreateReq(req: CreateBlogReq): BlogRecord {
    return {
      text: req.text,
      tags: req.tags,
    };
  }

  fromUpdateReq(req: CreateBlogReq): BlogRecord {
    return {
      text: req.text,
      tags: req.tags,
    };
  }

  toPrincipalRes(domain: BlogPrincipal): BlogPrincipalRes {
    return {
      id: domain.id,
      text: domain.record.text,
      tags: domain.record.tags,
    };
  }

  toRes(domain: Blog): BlogRes {
    return {
      principal: this.toPrincipalRes(domain.principal),
    };
  }
}

export { BlogApiV1Mapper };
