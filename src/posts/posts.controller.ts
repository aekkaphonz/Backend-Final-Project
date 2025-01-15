import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
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

  @Put(':id') // เพิ่ม endpoint สำหรับการอัปเดตข้อมูล
  async updatePost(@Param('id') id: string, @Body() updateData: Partial<CreatePostDto>) {
    const updatedPost = await this.postsService.update(id, updateData);
    if (!updatedPost) {
      throw new NotFoundException('Post not found');
    }
    return updatedPost;
  }

  @Delete(':id') // เพิ่มการลบข้อมูล
  async deletePost(@Param('id') id: string) {
    const result = await this.postsService.delete(id);
    if (!result) {
      throw new NotFoundException('Post not found');
    }
    return { message: 'Post deleted successfully' };
  }

  @Get('count/:authorId')
  async countPostsByAuthor(@Param('authorId') authorId: string) {
    const count = await this.postsService.countPostsByAuthor(authorId);
    return { count };
  }

}
