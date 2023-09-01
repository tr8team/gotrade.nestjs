import { Injectable } from '@nestjs/common';
import {
  Comment,
  CommentPrincipal,
  CommentRecord,
} from '../../domain/models/comment.model';
import { CommentEntity } from './entities/comment/comment.entity';

@Injectable()
class CommentDataMapper {
  fromRecord(domain: CommentRecord): CommentEntity {
    const entity = new CommentEntity();
    entity.text = domain.text;
    entity.likes = domain.likes;
    entity.dislikes = domain.dislikes;
    return entity;
  }

  fromPrincipal(domain: CommentPrincipal): CommentEntity {
    const entity = this.fromRecord(domain.record);
    entity.id = domain.id;
    return entity;
  }

  toRecord(data: CommentEntity): CommentRecord {
    return new CommentRecord(data.text, data.likes, data.dislikes);
  }

  toPrincipal(data: CommentEntity): CommentPrincipal {
    return new CommentPrincipal(data.id, this.toRecord(data));
  }

  toDomain(data: CommentEntity): Comment {
    return new Comment(this.toPrincipal(data), null!);
  }
}

export { CommentDataMapper };
