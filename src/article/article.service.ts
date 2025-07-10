import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Article } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';


@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
  ) {}

  async create(dto: CreateArticleDto, authorId: string) {
    const article = this.repo.create({
      ...dto,
      author: { id: authorId },
    });
    return this.repo.save(article);
  }

async findAll(tags: string | undefined, user?: { role?: string }) {
  const qb = this.repo.createQueryBuilder('a');
  if (!user) {
    qb.andWhere('a."isPublic" = true');
  }

  if (tags) {
    const list = tags.split(',').map((t) => t.trim().toLowerCase());
    qb.andWhere(':tags && a.tags', { tags: list });
  }
  return qb.orderBy('a.createdAt', 'DESC').getMany();
}

async findOne(id: string, user?: { userId?: string; role?: string }) {
  const art = await this.repo.findOne({ where: { id } });
  if (!art) throw new NotFoundException();

  if (!user && !art.isPublic) throw new ForbiddenException();

  return art;
}

  async update(
    id: string,
    dto: UpdateArticleDto,
    user: { userId: string; role: string },
  ) {
    const art = await this.repo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!art) throw new NotFoundException();

    const isOwner = art.author.id === user.userId;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException();

    Object.assign(art, dto);
    return this.repo.save(art);
  }

  async remove(id: string, user: { userId: string; role: string }) {
    const art = await this.repo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!art) throw new NotFoundException();

    const isOwner = art.author.id === user.userId;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) throw new ForbiddenException();

    await this.repo.delete(id);
    return { deleted: true };
  }
}
