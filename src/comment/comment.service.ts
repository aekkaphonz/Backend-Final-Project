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
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(PostComment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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
  ): Promise<PostComment> {
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
    createCommentDto: CreateCommentDto,
  ): Promise<PostComment> {
    const { postId, userId, comment } = createCommentDto;
  
    
    if (!mongoose.isValidObjectId(postId)) {
      throw new BadRequestException('Invalid postId format.');
    }
    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format.');
    }
  
  
    const newComment = new this.commentModel(createCommentDto);
  
   
    const savedComment = await newComment.save();
  

    await this.contentModel.findByIdAndUpdate(
      postId,
      { $push: { comments: savedComment._id } },
      { new: true, upsert: true },
    );
  
    return savedComment;
  }

  async getCommentsInContent(contentId: string) {
    const comments = await this.commentModel
      .find({ postId: contentId })
      .populate('userId', 'userName')
      .exec();
    return comments;
  }
}
