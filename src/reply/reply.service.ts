import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { InjectModel } from '@nestjs/mongoose';
import { commentReply, ReplyDocument } from './schemas/reply.schema';
import mongoose, { Model, Types } from 'mongoose';
import {
  CommentDocument,
  PostComment,
} from 'src/comment/schemas/comment.schema';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel(commentReply.name)
    private readonly replyModel: Model<ReplyDocument>,
    @InjectModel(PostComment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  findAll(): Promise<commentReply[]> {
    return this.replyModel.find().exec();
  }

  async addReply(createReplyDto: CreateReplyDto): Promise<commentReply> {
    const { commentId, userId, commentReply } = createReplyDto;

    if (!mongoose.isValidObjectId(commentId)) {
      throw new BadRequestException('Invalid postId format.');
    }
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format.');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new BadRequestException('comment not found.');
    }

    const newReply = new this.replyModel(createReplyDto);
    const saveReply = await newReply.save();

    await this.commentModel
      .findByIdAndUpdate(
        commentId,
        { $push: { reply: saveReply._id } },
        { new: true, upsert: false },
      )
      .exec();

    return saveReply;
  }

  async deleteById(
    id: string,
    user: { userId: string },
  ): Promise<commentReply> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid reply ID: ${id}`);
    }
    const userReply = await this.replyModel.findById(id).exec();
    if (!userReply) {
      throw new BadRequestException('Reply not found.');
    }
    if (userReply.userId.toString() !== user.userId.toString()) {
      throw new ForbiddenException('You are not allowed to delete this reply.');
    }

    const deletedReply = await this.replyModel.findByIdAndDelete(id).exec();
    if (!deletedReply) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    await this.commentModel
      .findOneAndUpdate({ reply: id }, { $pull: { reply: id } }, { new: true })
      .exec();

    return deletedReply;
  }

  async updateById(
    id: string,
    updateReplyDto: UpdateReplyDto,
    user: { userId: string },
  ): Promise<commentReply> {
    const { commentId } = updateReplyDto;

    const userReply = await this.replyModel.findById(id).exec();
    if (!userReply) {
      throw new BadRequestException('Reply not found.');
    }
    if (userReply.userId.toString() !== user.userId.toString()) {
      throw new ForbiddenException('You are not allowed to edit this reply.');
    }
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      throw new BadRequestException('Comment not found.');
    }
    const updatedCommentReply = await this.replyModel
      .findByIdAndUpdate(id, updateReplyDto, { new: true })
      .exec();

    return updatedCommentReply;
  }

  async findById(id: string): Promise<commentReply> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('please enter correct id.');
    }

    const reply = await this.replyModel.findById(id).exec();
    if (!reply) {
      throw new NotFoundException('Comment not found');
    }
    return reply;
  }
}
