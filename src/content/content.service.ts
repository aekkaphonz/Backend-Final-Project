import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './schemas/content.schema';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import {
  CommentDocument,
  PostComment,
} from 'src/comment/schemas/comment.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PostComment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async create(contentDto: CreateContentDto): Promise<Content> {
    const newContent = new this.contentModel(contentDto);
    console.log(newContent);
    return newContent.save();
  }

  async findAllByUserId(userId: string): Promise<Content[]> {
    console.log(" userId in findAllByUserId:", userId); 
    const contents = await this.contentModel.find({ userId }).exec();
    console.log(" Found contents:", contents); 
    return contents;
  }   

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }

  async updateContent(id: string, updateContentDto: Partial<CreateContentDto>) {
    const content = await this.contentModel.findByIdAndUpdate(
      id,
      updateContentDto,
      {
        new: true,
      },
    );
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  async deleteContentById(id: string): Promise<Content> {
    return await this.contentModel.findByIdAndDelete(id);
  }

  async getContentWithComments(contentId: string) {
    const contentWithComments = await this.contentModel
      .findById(contentId)
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'userName',
        },
        model: this.commentModel,
      })
      .exec();

    if (!contentWithComments) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    return contentWithComments;
  }

  async createContent(createContentDto: CreateContentDto): Promise<Content> {
    const { userId, title, detail, description, postImage } = createContentDto;

    const newContent = new this.contentModel({
      userId,
      title,
      detail,
      description,
      postImage,
    });

    try {
      const savedContent = await newContent.save();

      const user = await this.userModel.findByIdAndUpdate(
        userId,
        { $push: { content: savedContent._id } },
        { new: true },
      );

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return savedContent;
    } catch (error) {
      throw new BadRequestException(
        'Failed to create content.',
      );
    }
  }

  async findById(id: string): Promise<Content> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new BadRequestException('Invalid ID. Please try again.');
    }
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

}
