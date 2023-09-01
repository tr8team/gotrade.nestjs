import { InjectEntityManager } from '@mikro-orm/nestjs';
import { contexts } from '../../../constants';
import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { CommentDataMapper } from './comment.mapper';
import {
  CommentPrincipal,
  CommentRecord,
} from '../../domain/models/comment.model';
import { CommentEntity } from './entities/comment/comment.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ICommentRepository } from '../../domain/comment.repository';

@Injectable()
class CommentRepository implements ICommentRepository {
  constructor(
    @InjectEntityManager(contexts.COMMENT)
    private readonly db: EntityManager,
    @Inject(CommentDataMapper)
    private readonly mapper: CommentDataMapper,
  ) {}

  async create(
    blogId: string,
    comment: CommentRecord,
  ): Promise<CommentPrincipal> {
    const data = this.mapper.fromRecord(comment);
    data.blogId = blogId;
    this.db.create(CommentEntity, data);
    this.db.persist(data);
    await this.db.flush();
    return this.mapper.toPrincipal(data);
  }

  async delete(_: string, id: string): Promise<void> {
    const comment = this.db.getReference(CommentEntity, id);
    await this.db.remove(comment).flush();
  }

  async get(_: string, id: string): Promise<CommentPrincipal | null> {
    const comment = await this.db.findOne(CommentEntity, id);
    if (!comment) {
      return null;
    }
    return this.mapper.toPrincipal(comment);
  }

  async search(
    search?: string,
    limit?: number,
    skip?: number,
    blogId?: string,
  ): Promise<CommentPrincipal[]> {
    const filter: FilterQuery<CommentEntity> = {};
    if (search) filter.text = { $like: `%${search}%` };
    if (blogId) filter.blogId = blogId;

    const r = await this.db.find(CommentEntity, filter, {
      limit,
      offset: skip,
    });
    return r.map(x => this.mapper.toPrincipal(x));
  }

  async update(
    _: string,
    id: string,
    comment: CommentRecord,
  ): Promise<CommentPrincipal> {
    const v2 = this.mapper.fromRecord(comment);
    const v1 = this.db.getReference(CommentEntity, id);
    Object.assign(v1, v2);
    await this.db.flush();
    return this.mapper.toPrincipal(v1);
  }
}

export { CommentRepository };
