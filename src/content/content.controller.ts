import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ContentService } from './content.service';

import { Content } from './schemas/content.schema';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get() //ตอนยิงใช้ URL path http://localhost:3001/contents
  getAllContent() {
    return this.contentService.findAll();
  }


  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Get
  getContent(
    @Param('id')
    id: string,
  ): Promise<Content> {
    return this.contentService.findById(id);
  }

  @Put(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Put
  async updateContent(
    @Param('id')
    id: string,
    @Body()
    content: UpdateContentDto,
  ): Promise<Content> {
    return this.contentService.updateById(id, content);
  }

  @Delete(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Delete
  async deleteContent(
    @Param('id')
    id: string,
  ): Promise<Content> {
    return this.contentService.deleteById(id);
  }

  @Post("/createContent") //ตอนยิงใช้ URL path http://localhost:3001/contents/createContent
  async createContent(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('detail') detail: string,
    @Body('description') description: string,
    @Body('image') image: string,
  ) {
    return this.contentService.createContent(
      userId,
      title,
      detail,
      description,
      image,
    );
  }
}
