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
import { Post as PostSchema } from './schemas/posts.schemas';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto, @Body('userId') userId: string) {
    const postData = { ...createPostDto, userId }; // รวม userId เข้ากับข้อมูลโพสต์
    return this.postsService.create(postData);
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
}
