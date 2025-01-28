import {Controller,Get,Post,Body,Patch,Param,Delete,NotFoundException,Put,} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GetCommentDto } from './dto/get-comment-dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Create comment' })
  @ApiOkResponse({ type: GetCommentDto })
  @Post('/addComment')
  async addComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.addComment(createCommentDto);
  }
  
  @ApiOperation({ summary: 'Get comments in content' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get('content/:id')
  async getCommentsInContent(@Param('id') contentId: string) {
    const comments = await this.commentService.getCommentsInContent(contentId);
    if (!comments) {
      throw new NotFoundException(`No comments found for content ID ${contentId}`);
    }
    return comments;
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @Delete(':id')
  async deleteComment(@Param('id') id: string): Promise<{ message: string }> {
    const deletedComment = await this.commentService.deleteById(id);
    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return { message: 'Delete successful' };
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiOkResponse({ type: [GetCommentDto] })
  @Get()
  getAllComments() {
    return this.commentService.findAll();
  }

@ApiOperation({ summary: 'Get comment by ID' })
@ApiOkResponse({ type: GetCommentDto })
@Get(':id') // Endpoint: /comments/:id
async getComment(@Param('id') id: string) {
  return this.commentService.findById(id);
}


  @ApiOperation({ summary: 'Update comment' })
  @ApiOkResponse({ type: GetCommentDto })
  @Put(':id')
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateById(id, updateCommentDto);
  }
}
