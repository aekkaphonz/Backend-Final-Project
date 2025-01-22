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
import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetContentDto } from './dto/get-content.dto';


@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: 'Get all content' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get() //ตอนยิงใช้ URL path http://localhost:3001/contents
  getAllContent() {
    return this.contentService.findAll();
  }

  @ApiOperation({ summary: 'Update content' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Put(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Put
  async updateContent(
    @Param('id')
    id: string,
    @Body()
    content: UpdateContentDto,
  ): Promise<Content> {
    return this.contentService.updateById(id, content);
  }

  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Get
  async getContent(@Param('id') contentId: string) {
    const content = await this.contentService.getContentWithComments(contentId);
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
    return content;
  }

  @ApiOperation({ summary: 'Delete content' })
  @ApiOkResponse({description : 'Delete successfully'})
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
}
