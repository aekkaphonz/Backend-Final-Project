import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './schemas/content.schema';
import { UpdateContentDto } from './dto/update-content.dto';


@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get() //ตอนยิงใช้ URL path http://localhost:3001/contents
  getAllContent() {
    return this.contentService.findAll();
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

  @Get('detail/:id') //ตอนยิงใช้ URL path http://localhost:3001/contents/detail:id method Get
  async getContent(@Param('id') contentId: string) {
    const content = await this.contentService.getContentWithComments(contentId);
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
    return content;
  }

  @Delete(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Delete
  async deleteContent(
    @Param('id')
    id: string,
  ): Promise<Content> {
    return this.contentService.deleteById(id);
  }

  @Post('/createContent') //ตอนยิงใช้ URL path http://localhost:3001/contents/createContent
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

  @Get(':id')
  async getContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findById(id);
  }
}
