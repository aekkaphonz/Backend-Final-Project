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
  Query,
  Req,
  UnauthorizedException,
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
import { UserService } from 'src/user/user.service';

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

  @Get('all')
  async getAllContents() {
    return this.contentService.findAll();
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
    const existingContent = await this.contentService.findById(id);
    if (!existingContent) {
      throw new NotFoundException('Content not found');
    }

    if (file) {
      updateContentDto.postImage = `/uploads/${file.filename}`; // ✅ ใช้ path ที่ถูกต้อง
    }

    // ✅ ตรวจสอบว่า `tags` เป็น `string` ก่อน `JSON.parse()`
    if (typeof updateContentDto.tags === "string") {
      try {
        updateContentDto.tags = JSON.parse(updateContentDto.tags);
      } catch (error) {
        throw new BadRequestException('Invalid tags format.');
      }
    }

    // ✅ ตรวจสอบว่า `tags` เป็น `array`
    if (!Array.isArray(updateContentDto.tags)) {
      throw new BadRequestException('Tags must be an array.');
    }

    return this.contentService.updateContent(id, updateContentDto);
  }

  @ApiOperation({ summary: 'Get detail content & comment' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get(':identifier')
  async getContent(@Param('identifier') identifier: string) {
    if (!identifier) {
      throw new BadRequestException('Identifier parameter is required.');
    }

    // ตรวจสอบว่าเป็น ObjectId (24 ตัวอักษรฐาน 16)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    if (isObjectId) {
      return this.contentService.getById(identifier);
    } else {
      return this.contentService.getByTitle(identifier);
    }
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
    console.log("📥 รับข้อมูลจาก Frontend:", createContentDto);
    console.log("📷 ไฟล์ภาพที่ได้รับ:", file);

    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type.');
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

  @Get("search")
  async searchContent(@Query("search") searchQuery: string) {
    console.log("🔍 Search Query:", searchQuery); // Debug Query
    return this.contentService.searchContents(searchQuery);
  }


  @Post('updateViews/:id')
  async updateViews(@Param('id') id: string, @Body('userId') userId: string) {
    return this.contentService.updateViews(id, userId);
  }

  @ApiOperation({ summary: 'Get content by tag' })
  @ApiOkResponse({ type: [GetContentDto] })
  @Get('searchByTag')
  async searchContentByTag(@Query('tag') tag: string) {
    if (!tag) {
      throw new BadRequestException('Tag is required');
    }
    return this.contentService.findByTag(tag);
  }

  @Post(':id/like')
  async toggleLike(
    @Param('id') postId: string,
    @Body() body: { userId: string },
  ): Promise<Content> {
    return this.contentService.toggleLike(postId, body.userId);
  }
}
