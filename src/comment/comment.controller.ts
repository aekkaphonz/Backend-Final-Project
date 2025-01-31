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
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetCommentDto } from './dto/get-comment-dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create comment' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Post('/addComment')
  async addComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.addComment(createCommentDto);
  }

  @ApiOperation({ summary: 'Get comment in content' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get('content/:id')
  async getCommentsInContent(@Param('id') contentId: string) {
    console.log('Received contentId:', contentId);
    const comments = await this.commentService.getCommentsInContent(contentId);
    console.log('Comments:', comments);
    if (!comments) {
      throw new NotFoundException(
        `No comments found for Content with ID ${contentId}`,
      );
    }
    return comments;
  }

  @ApiOperation({ summary: 'Edit Comment' })
@Put(':id')
async updateComment(
  @Param('id') id: string,
  @Body() updateCommentDto: UpdateCommentDto,
  @Req() req: any,
) {
  if (!req.user || !req.user.userId) {
    throw new UnauthorizedException('User is not authenticated.');
  }

  const existingComment = await this.commentService.findById(id);
  if (!existingComment) {
    throw new NotFoundException(`Comment with ID ${id} not found`);
  }

  // ตรวจสอบว่า userId ของคอมเมนต์ตรงกับ userId ของผู้ใช้งาน
  if (existingComment.userId !== req.user.userId) {
    throw new UnauthorizedException('You are not authorized to edit this comment');
  }

  return this.commentService.updateById(id, updateCommentDto, req.user);
}

@ApiOperation({ summary: 'Delete comment' })
@Delete(':id')
async deleteComment(
  @Param('id') id: string,
  @Req() req: any,
): Promise<{ message: string }> {
  if (!req.user || !req.user.userId) {
    throw new UnauthorizedException('User is not authenticated.');
  }

  const existingComment = await this.commentService.findById(id);
  if (!existingComment) {
    throw new NotFoundException(`Comment with ID ${id} not found`);
  }

  // ตรวจสอบว่า userId ของคอมเมนต์ตรงกับ userId ของผู้ใช้งาน
  if (existingComment.userId !== req.user.userId) {
    throw new UnauthorizedException('You are not authorized to delete this comment');
  }

  const deletedComment = await this.commentService.deleteById(id, req.user);
  if (!deletedComment) {
    throw new NotFoundException(`Comment with ID ${id} not found`);
  }

  return { message: 'delete successful' };
} 

  @ApiOperation({ summary: 'Get all content' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get()
  getAllComment() {
    return this.commentService.findAll();
  }

  @ApiOperation({ summary: 'Get CommentById' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get(':id')
  async getComment(@Param('id') id: string) {
    return this.commentService.findById(id);
  }

  @Get('CommentWithReply/:id')
  async getCommentWithReplies(@Param('id') id: string) {
    const comment = await this.commentService.getCommentWithReplies(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }
}
