import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('articles')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query('tags') tags: string, @CurrentUser() user?) {
    return this.service.findAll(tags, user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?) {
    return this.service.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() u, @Body() dto: CreateArticleDto) {
    return this.service.create(dto, u.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() u, @Body() dto: UpdateArticleDto) {
    return this.service.update(id, dto, u);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() u) {
    return this.service.remove(id, u);
  }
}
