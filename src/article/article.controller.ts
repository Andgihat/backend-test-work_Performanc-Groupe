import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('articles')
export class ArticleController {
  constructor(private readonly articles: ArticleService) {}

  @Post()
  create(
    @CurrentUser() user,
    @Body() dto: CreateArticleDto,
  ) {
    return this.articles.create(dto, user.userId);
  }


  @Get()
  findAll(@CurrentUser() user) {
    return this.articles.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articles.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articles.update(id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.articles.remove(id, user);
  }
}

