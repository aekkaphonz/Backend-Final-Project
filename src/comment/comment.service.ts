import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PostComment, CommentDocument } from './schemas/comment.schema';
import mongoose, { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { Content, ContentDocument } from 'src/content/schemas/content.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(PostComment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  findAll(): Promise<Comment[]> {
    return this.commentModel.find().exec();
  }

  async findById(id: string): Promise<Comment> {
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
  ): Promise<Comment> {
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(id, updateCommentDto, { new: true })
      .exec();

    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return updatedComment;
  }

  async deleteById(id: string): Promise<Comment> {
    return await this.commentModel.findByIdAndDelete(id);
  }

  async addComment(
    postId: string,
    userId: string,
    comment: string,
  ): Promise<Comment> {
    const newComment = new this.commentModel({
      postId,
      userId,
      comment,
    });

    const savedComment = await newComment.save();

    const updatedContent = await this.contentModel.findByIdAndUpdate(
      postId,
      { $push: { comments: savedComment._id } },
      { new: true },
    );
    console.log('Updated Content:', updatedContent);
    if (!updatedContent) {
      throw new NotFoundException(`Content with ID ${postId} not found`);
    }

    // เผื่อใช้
    // const user = await this.userModel.findByIdAndUpdate(
    //   userId,
    //   { $push: { comments: savedComment._id } },
    //   { new: true },
    // );
    // console.log('Updated User:', user);

    // if (!user) {
    //   throw new NotFoundException(`User with ID ${userId} not found`);
    // }

    return savedComment;
  }
  async getCommentsInContent(contentId: string) {
    console.log('Fetching comments for Content ID:', contentId);
    const comments = await this.commentModel
      .find({ postId: contentId })
      .populate('userId', 'userName')
      .exec();
    console.log('Comments:', comments);
    return comments;
  }
}
