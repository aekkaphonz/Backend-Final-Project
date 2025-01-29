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
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { commentReply } from './schemas/reply.schema';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}


 @ApiOperation({ summary: 'Get all reply' })
  @Get()
  getAllComment() {
    return this.replyService.findAll();
  }

   @ApiOperation({ summary: 'Get CommentById' })
    @Get(':id')
    async getComment(@Param('id') id: string) {
      return this.replyService.findById(id);
    }

  @Post('addReply')
  async addReply(
    @Body() createReplyDto: CreateReplyDto,
  ): Promise<commentReply> {
    return this.replyService.addReply(createReplyDto);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiOkResponse({ description: 'Delete successfully' })
  @Delete(':id')
  async deleteComment(
    @Param('id')
    id: string,
    @Req() req: any,
  ): Promise<{ message: string }> {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('User is not authenticated.');
    }
    const deletedReply = await this.replyService.deleteById(id,req.user);
    if (!deletedReply) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return { message: 'delete successful' };
  }

   @ApiOperation({ summary: 'Edit Comment' })
    @Put(':id')
    async updateComment(
      @Param('id') id: string,
      @Body() updateReplyDto: UpdateReplyDto,
      @Req() req: any,
    ) {
       if (!req.user || !req.user.userId) {
            throw new UnauthorizedException('User is not authenticated.');
          }
      return this.replyService.updateById(id, updateReplyDto,req.user);
    }
}
