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
} from '@nestjs/common';
import { ContentService } from './content.service';
import { Content } from './schemas/content.schema';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ summary: 'Get all content' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get() //ตอนยิงใช้ URL path http://localhost:3001/contents
  getAllContent() {
    return this.contentService.findAll();
  }

  @Put(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Put
  async updateContent(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateContentDto: Partial<CreateContentDto>,
  ) {
    const previousContent  = await this.contentService.findById(id);
    if (!previousContent ) {
      throw new NotFoundException('Content not found');
    }

    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Unsupported file type. Please upload a valid image.',
        );
      }

      const base64Image = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      updateContentDto.postImage = `data:${mimeType};base64,${base64Image}`;
    } else if (!updateContentDto.postImage) {
      
      updateContentDto.postImage = previousContent .postImage;
    }

    return this.contentService.updateContent(id, updateContentDto);
  }

  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Get
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
}
