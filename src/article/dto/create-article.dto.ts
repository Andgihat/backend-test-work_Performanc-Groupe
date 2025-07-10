import { IsArray, IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
  @IsString() @MinLength(3) title: string;
  @IsString() body: string;

  @IsOptional() @IsBoolean() isPublic?: boolean = true;

  @IsOptional() @IsArray() @IsString({ each: true })
  tags?: string[] = [];
}


