import { Module } from '@nestjs/common';
import { BlogService } from './domain/blog.service';
import { BlogRepository } from './adapters/database/blog.repository';
import { BlogDataMapper } from './adapters/database/blog.mapper';
import { BlogApiV1Mapper } from './adapters/api/v1/blog.mapper';
import { BlogV1Controller } from './adapters/api/v1/blog.controller';
import { CommentRepository } from './adapters/database/comment.repository';
import { CommentDataMapper } from './adapters/database/comment.mapper';

@Module({
  controllers: [BlogV1Controller],
  providers: [
    BlogService,
    BlogRepository,
    BlogDataMapper,
    BlogApiV1Mapper,
    CommentRepository,
    CommentDataMapper,
  ],
})
export class BlogModule {}
