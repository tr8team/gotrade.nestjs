import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { BlogService, IBlogService } from '../../../domain/blog.service';
import { BlogPrincipalRes, BlogRes } from './dto/blog.res';
import { CreateBlogReq, SearchBlogQuery } from './dto/blog.req';
import { BlogApiV1Mapper } from './blog.mapper';
import { redis } from '../../../../constants';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import { PinoLogger } from 'nestjs-pino';
import { context, Counter, trace } from '@opentelemetry/api';
import { OtelCounter, OtelMethodCounter } from 'nestjs-otel';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

@Controller({ version: '1', path: 'blogs' })
export class BlogV1Controller {
  constructor(
    @Inject(BlogService) private readonly service: IBlogService,
    @Inject(BlogApiV1Mapper) private readonly mapper: BlogApiV1Mapper,
    @Inject(PinoLogger) private readonly logger: PinoLogger,
    @Inject(redis.MAIN) private readonly cache: Redis,
    @Inject(ConfigService) private readonly config: ConfigService,
  ) {}

  @Get()
  async search(@Query() query: SearchBlogQuery): Promise<BlogPrincipalRes[]> {
    const blogs = await this.service.search(
      query.search,
      query.limit,
      query.skip,
    );
    return blogs.map(x => this.mapper.toPrincipalRes(x));
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<BlogRes> {
    const blog = await this.service.get(id);
    if (blog != null) return this.mapper.toRes(blog);
    throw new HttpException('Blog not found', 404);
  }

  @Post()
  async create(@Body() req: CreateBlogReq): Promise<BlogPrincipalRes> {
    const domain = this.mapper.fromCreateReq(req);
    const blog = await this.service.create(domain);
    return this.mapper.toPrincipalRes(blog);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() req: CreateBlogReq,
  ): Promise<BlogPrincipalRes> {
    const domain = this.mapper.fromUpdateReq(req);
    const blog = await this.service.update(id, domain);
    return this.mapper.toPrincipalRes(blog);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }

  @Get('test/:id')
  async test(@Param('id') id: string): Promise<string> {
    return (await this.cache.get(id)) ?? 'not found';
  }

  @Post('test/:id/:val')
  async test2(
    @Param('id') id: string,
    @Param('val') val: string,
  ): Promise<string> {
    return (await this.cache.set(id, val)) ?? 'not found';
  }

  @Get('random')
  @OtelMethodCounter()
  async random(): Promise<string> {
    return 'new';
  }

  @Get('secret')
  secret(
    @OtelCounter('s_counter')
    counter: Counter,
  ): string {
    counter.add(5, { user: '7f106bdc-175c-4444-88b0-6e9db36f51a5' });
    return this.config.get<string>('secret') ?? 'not found';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadFile(@UploadedFile() file: File): Promise<string> {
    try {
      const span = trace.getSpan(context.active());
      console.log('span', span);
      this.logger.info(file.buffer?.toString());
      return 'ok';
    } catch (e) {
      this.logger.error(e);
      return 'error';
    }
  }
}
