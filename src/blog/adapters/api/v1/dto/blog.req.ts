import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

class CreateBlogReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2048)
  text!: string;

  @MaxLength(128, {
    each: true,
  })
  tags!: string[];
}

class UpdateBlogReq {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2048)
  text!: string;

  @MaxLength(128, {
    each: true,
  })
  tags!: string[];
}

class SearchBlogQuery {
  @IsOptional()
  @Max(100)
  @Min(1)
  limit?: number;

  @IsOptional()
  @Min(0)
  skip?: number;

  @IsOptional()
  search?: string;
}

export { CreateBlogReq, UpdateBlogReq, SearchBlogQuery };
