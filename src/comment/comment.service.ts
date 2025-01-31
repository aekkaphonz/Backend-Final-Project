import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostComment, CommentDocument } from './schemas/comment.schema';
import mongoose, { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Content, ContentDocument } from 'src/content/schemas/content.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { commentReply, ReplyDocument } from 'src/reply/schemas/reply.schema';


@Injectable()
export class CommentService {
  constructor(
    @InjectModel(PostComment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(commentReply.name)
    private readonly replyModel: Model<ReplyDocument>,
  ) {}

  findAll(): Promise<PostComment[]> {
    return this.commentModel.find().exec();
  }

  async findById(id: string): Promise<PostComment> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('please enter correct id.');
    }

    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async updateById(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: { userId: string },
  ): Promise<PostComment> {
    const { postId } = updateCommentDto;

    const userComment = await this.commentModel.findById(id).exec();
    if (!userComment) {
      throw new BadRequestException('Comment not found.');
    }
    if (userComment.userId.toString() !== user.userId.toString()) {
      throw new ForbiddenException('You are not allowed to edit this comment.');
    }

    const post = await this.contentModel.findById(postId).exec();
    if (!post) {
      throw new BadRequestException('Post not found.');
    }

    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();

    return updatedComment;
  }

  async deleteById(
    id: string,
    user: { userId: string },
  ): Promise<PostComment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid comment ID: ${id}`);
    }
    const userComment = await this.commentModel.findById(id).exec();
    if (!userComment) {
      throw new BadRequestException('Comment not found.');
    }
    if (userComment.userId.toString() !== user.userId.toString()) {
      throw new ForbiddenException('You are not allowed to delete this comment.');
    }

    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    await this.contentModel
      .findOneAndUpdate(
        { comments: id },
        { $pull: { comments: id } },
        { new: true },
      )
      .exec();

    return deletedComment;
  }

  async addComment(createCommentDto: CreateCommentDto): Promise<PostComment> {
    const { postId, userId, comment } = createCommentDto;

    if (!mongoose.isValidObjectId(postId)) {
      throw new BadRequestException('Invalid postId format.');
    }
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format.');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const post = await this.contentModel.findById(postId).exec();
    if (!post) {
      throw new BadRequestException('Post not found.');
    }

    const newComment = new this.commentModel({
      postId,
      userId,
      comment,
      userName: user.userName,
    });

    const savedComment = await newComment.save();

    await this.contentModel
      .findByIdAndUpdate(
        postId,
        { $push: { comments: savedComment._id } },
        { new: true, upsert: false },
      )
      .exec();

    return savedComment;
  }

  async getCommentsInContent(contentId: string) {
    const comments = await this.commentModel
      .find({ postId: contentId })
      .populate('userId', 'userName')
      .exec();
    return comments;
  }

  async getCommentWithReplies(commentId: string) {
    const comment = await this.commentModel
      .findById(commentId)
      .populate({
        path: 'reply',
        model: this.replyModel,
      })

    return comment;
  }
}