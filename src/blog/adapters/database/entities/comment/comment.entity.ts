import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../../../common/base.entity';

@Entity({ tableName: 'comments' })
export class CommentEntity extends BaseEntity {
  @Property()
  blogId!: string;

  @Property()
  text!: string;

  @Property()
  likes!: number;

  @Property()
  dislikes!: number;
}
