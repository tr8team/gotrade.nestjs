import { Module } from '@nestjs/common';
import { BlogService } from './domain/blog.service';
import { BlogRepository } from './adapters/database/blog.repository';
import { BlogDataMapper } from './adapters/database/blog.mapper';
import { BlogApiV1Mapper } from './adapters/api/v1/blog.mapper';
import { BlogV1Controller } from './adapters/api/v1/blog.controller';

@Module({
  controllers: [BlogV1Controller],
  providers: [BlogService, BlogRepository, BlogDataMapper, BlogApiV1Mapper],
})
export class BlogModule {}
