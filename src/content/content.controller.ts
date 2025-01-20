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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetContentDto } from './dto/get-content.dto';
import { CreateContentDto } from './dto/create-content.dto';

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

  @ApiOperation({ summary: 'Get detail content & comment' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get('detail/:id') //ตอนยิงใช้ URL path http://localhost:3001/contents/detail:id method Get
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

  @ApiOperation({ summary: 'Create content' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Post('/createContent')
  async createContent(@Body() createContent: CreateContentDto) {
    console.log('Received Data:', createContent);
    return this.contentService.create(createContent);
  }

  @ApiOkResponse({ type: [GetContentDto] })
  @ApiOperation({ summary: 'Get only content' })
  @Get(':id')
  async getContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findById(id);
  }
}


 // @ApiOperation({ summary: 'Create content' })
  // @ApiOkResponse({ type: [CreateContentDto] })
  // @Post('/createContent') //ตอนยิงใช้ URL path http://localhost:3001/contents/createContent
  // async createContent(
  //   @Body('userId') userId: string,
  //   @Body('title') title: string,
  //   @Body('detail') detail: string,
  //   @Body('description') description: string,
  //   @Body('image') image: string,
  // ) {
  //   return this.contentService.createContent(
  //     userId,
  //     title,
  //     detail,
  //     description,
  //     image,
  //   );
  // }
