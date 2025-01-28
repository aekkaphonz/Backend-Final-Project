import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostSchema } from './schemas/posts.schemas';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (file) {
      const base64Image = file.buffer.toString('base64');
      const mimeType = file.mimetype;

      createPostDto.images = [`data:${mimeType};base64,${base64Image}`];
    }

    return this.postsService.create(createPostDto);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('images')) // ✅ ตรวจสอบว่ารองรับการรับไฟล์
  async updatePost(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    console.log("รับข้อมูลอัปเดต:", updatePostDto);
    console.log("ไฟล์ที่อัปโหลด:", file);

    if (file) {
      const base64Image = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      updatePostDto.images = [`data:${mimeType};base64,${base64Image}`];
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Get()
  async getAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  @Delete(':id') // เพิ่มการลบข้อมูล
  async deletePost(@Param('id') id: string) {
    const result = await this.postsService.delete(id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return { message: 'Post deleted successfully' };
  }

  @Get('count/:userId')
  async countPostsByUser(@Param('userId') userId: string) {
    const count = await this.postsService.countPostsByAuthor(userId);
    return { postCount: count };
  }


  @Put(':id/view')
  async incrementView(@Param('id') id: string): Promise<PostSchema> {
    return this.postsService.incrementView(id);
  }

  @Put(':id/like')
  async incrementLike(@Param('id') id: string): Promise<PostSchema> {
    return this.postsService.incrementLike(id);
  }

  @Get('search/:title')
async searchPostsByTitle(@Param('title') title: string) {
  const posts = await this.postsService.searchByTitle(title);
  if (!posts || posts.length === 0) {
    throw new NotFoundException('No posts found');
  }
  return posts;
}



}
