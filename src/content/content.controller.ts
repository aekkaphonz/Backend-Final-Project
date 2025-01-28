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
  UploadedFile,
  UseInterceptors,
  Query
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
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from "src/user/user.service"; 

@Controller('contents')
export class ContentController {
  constructor(
    private readonly contentService: ContentService,
    private readonly userService: UserService,
  ) { }

  @ApiOperation({ summary: 'Get all content for specific user' })
  @ApiOkResponse({ type: [GetContentDto] })

  @Get('all')
  fetchAllContents() {
    return this.contentService.findAll();

  }

  
  @ApiOperation({ summary: 'Get all content for specific user' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get()
  async getAllContent(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('UserId is required');
    }
    return this.contentService.findAllByUserId(userId);
  }

  @ApiOperation({ summary: 'Update content' })
  @ApiOkResponse({ type: GetContentDto })
  @Put('updateContent/:id')
  @UseInterceptors(FileInterceptor('postImage'))
  async updateContent(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateContentDto: Partial<CreateContentDto>,
  ) {
    const previousContent = await this.contentService.findById(id);
    if (!previousContent) {
      throw new NotFoundException('Content not found');
    }

    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type.',
        );
      }

      const base64Image = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      updateContentDto.postImage = `data:${mimeType};base64,${base64Image}`;
    } else if (!updateContentDto.postImage) {

      updateContentDto.postImage = previousContent.postImage;
    }

    return this.contentService.updateContent(id, updateContentDto);
  }

  @ApiOperation({ summary: 'Get detail content & comment' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get('detail/:id')
  async getContent(@Param('id') contentId: string) {
    const content = await this.contentService.getContentWithComments(contentId);
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
    return content;
  }

  @ApiOperation({ summary: 'Delete content' })
  @ApiOkResponse({ description: 'Delete successfully' })
  @Delete(':id')
  async deleteContent(
    @Param('id')
    id: string,
  ): Promise<Content> {
    return this.contentService.deleteContentById(id);
  }

  @ApiOperation({ summary: 'Create content' })
  @ApiOkResponse({ type: GetContentDto })
  @Post('createContent')
  @UseInterceptors(FileInterceptor('postImage'))
  async createContent(
    @UploadedFile() file: Express.Multer.File,
    @Body() createContentDto: CreateContentDto,
  ) {
    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type.',
        );
      }

      const base64Image = file.buffer.toString('base64');
      const mimeType = file.mimetype;

      createContentDto.postImage = `data:${mimeType};base64,${base64Image}`;
    }

    return this.contentService.createContent(createContentDto);
  }

  @ApiOkResponse({ type: [GetContentDto] })
  @ApiOperation({ summary: 'Get only content' })
  @Get(':id')
  async getContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findById(id);
  }

  
}
