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
import { ApiOperation } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetCommentDto } from './dto/get-comment-dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PostComment } from './schemas/comment.schema';



@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/addComment') //ตอนยิงใช้ URL path http://localhost:3001/comments/addComment
  async addComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.addComment(createCommentDto);
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
    @Param('id') id: string,
  ): Promise<{ message: string; deletedComment: PostComment }> {
    const deletedComment = await this.commentService.deleteById(id);
    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return { message: 'Delete successful', deletedComment };
  }

  @ApiOperation({ summary: 'Get all content' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get()
  getAllComment() {
    return this.commentService.findAll();
  }


  @ApiOperation({ summary: 'Get CommentById' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/comments/<id> method Get
  async getComment(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  
  @Put(':id') 
  async updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<{ message: string; updatedComment: PostComment }> {
    const updatedComment = await this.commentService.updateById(
      id,
      updateCommentDto,
    );
    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return { message: 'Update successful', updatedComment };
  }

}
  
