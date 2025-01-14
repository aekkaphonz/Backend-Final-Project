import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/addComment') //ตอนยิงใช้ URL path http://localhost:3001/comments/addComment
  async addComment(
    @Body('postId') postId: string,
    @Body('userId') userId: string,
    @Body('comment') comment: string,
  ) {
    return this.commentService.addComment(postId, userId, comment);
  }

  @Get('content/:id') //ตอนยิงใช้ URL path http://localhost:3001/comments/content/<id> id ของ post หรือ content นั้นไว้ดู comment ทั้งหมดใน post
  async getCommentsInContent(@Param('id') contentId: string) {
    console.log('Received contentId:', contentId);
    const comments =
      await this.commentService.getCommentsInContent(contentId);
    console.log('Comments:', comments);
    if (!comments) {
      throw new NotFoundException(
        `No comments found for Content with ID ${contentId}`,
      );
    }
    return comments;
  }
 
  @Delete(':id') //ตอนยิงใช้ URL path http://localhost:3001/comments/<id> method Delete
  async deleteComment(
    @Param('id')
    id: string,
  ): Promise<{message:string}> {
    const deletedComment = await this.commentService.deleteById(id);
    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return  { message: 'delete successful' }; 
  }

  @Get()
  getAllComment() {
    return this.commentService.findAll();
  }

  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/comments/<id> method Get
  async getComment(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  
  @Put(':id') 
  async updateContent(
    @Param('id') id: string,
    @Body() content: UpdateCommentDto,
  ): Promise<{ message: string }> {
    const updated = await this.commentService.updateById(id, content);
    if (!updated) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return { message: 'Update successful' };
  }
  
  
}
