import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ContentService } from './content.service';

import { Content } from './schemas/content.schema';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getAllContent() {
    return this.contentService.findAll();
  }

  @Post('/new_content')
  create(@Body() contentDto: CreateContentDto) {
    return this.contentService.create(contentDto);
  }

  @Get(':id')
  getContent(
    @Param('id')
    id: string,
  ): Promise<Content> {
    return this.contentService.findById(id);
  }

  @Put(':id')
  async updateContent(
    @Param('id')
    id: string,
    @Body()
    content : UpdateContentDto
  ): Promise<Content> {
    return this.contentService.updateById(id,content);
  }

  @Delete(':id')
  async deleteContent(
    @Param('id')
    id: string,
  ): Promise<Content> {
    return this.contentService.deleteById(id);
  }
}
