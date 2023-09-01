import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../../../common/base.entity';

@Entity({ tableName: 'blogs' })
export class BlogEntity extends BaseEntity {
  @Property()
  text!: string;

  @Property()
  tags!: string;

  @Property({
    nullable: true,
    default: 0,
  })
  likes!: number;
}
