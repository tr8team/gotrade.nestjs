import {
  Blog,
  BlogPrincipal,
  BlogRecord,
} from '../../domain/models/blog.model';
import { BlogEntity } from './entities/main/blog.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
class BlogDataMapper {
  fromRecord(domain: BlogRecord): BlogEntity {
    const entity = new BlogEntity();
    entity.text = domain.text;
    entity.tags = JSON.stringify(domain.tags);
    return entity;
  }

  fromPrincipal(domain: BlogPrincipal): BlogEntity {
    const entity = this.fromRecord(domain.record);
    entity.id = domain.id;
    return entity;
  }

  toRecord(data: BlogEntity): BlogRecord {
    return new BlogRecord(data.text, JSON.parse(data.tags));
  }

  toPrincipal(data: BlogEntity): BlogPrincipal {
    return new BlogPrincipal(data.id, this.toRecord(data));
  }

  toDomain(data: BlogEntity): Blog {
    return new Blog(this.toPrincipal(data));
  }
}

export { BlogDataMapper };
