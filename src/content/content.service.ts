import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './schemas/content.schema';
import mongoose, { Model, Types } from 'mongoose';
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
  ) { }

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const { userId, title, detail, description, comments, postImage } =
      createContentDto;

    if (!mongoose.isValidObjectId(userId)) {
      throw new BadRequestException('Invalid userId format.');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException('User not found.');
    }
    const newContent = new this.contentModel({
      userId,
      title,
      detail,
      description,
      comments,
      postImage,
      userName: user.userName,
    });

    const saveContent = await newContent.save();

    return saveContent
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

  // async createContent(createContentDto: CreateContentDto): Promise<Content> {
  //   let { userId, title, detail, postImage, tags } = createContentDto;

    

  //   const newContent = new this.contentModel({
  //     userId,
  //     title,
  //     detail,
  //     postImage,
  //     tags,
  //   });

  //   return await newContent.save();
  // }

  async createContent(createContentDto: CreateContentDto): Promise<Content> {
    let { userId, title, detail, description, postImage,tags } = createContentDto;

    if (!Array.isArray(tags)) {
      tags = typeof tags === "string" ? [tags] : [];
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newContent = new this.contentModel({
      userId,
      title,
      detail,
      description,
      postImage,
      tags,
      userName: user.userName, 
    });

    try {
      const savedContent = await newContent.save();

      await this.userModel.findByIdAndUpdate(
        userId,
        { $push: { content: savedContent._id } },
        { new: true },
      );

      return savedContent;
    } catch (error) {
      throw new BadRequestException('Failed to create content.');
    }
}


  async updateContent(id: string, updateContentDto: Partial<CreateContentDto>) {
    const content = await this.contentModel.findById(id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    if (updateContentDto.tags) {
      try {
        updateContentDto.tags = typeof updateContentDto.tags === 'string'
          ? JSON.parse(updateContentDto.tags)
          : updateContentDto.tags;

        if (!Array.isArray(updateContentDto.tags)) {
          throw new BadRequestException('Tags must be an array.');
        }
      } catch (error) {
        throw new BadRequestException('Invalid tags format.');
      }
    }

    return await this.contentModel.findByIdAndUpdate(id, updateContentDto, { new: true });
  }

  async deleteContentById(id: string): Promise<Content> {
    return await this.contentModel.findByIdAndDelete(id);
  }

  async getContentWithComments(contentId: string) {
    const contentWithComments = await this.contentModel
      .findById(contentId)
      .populate({
        path: 'comments',
        select: 'userId',
        model: this.commentModel,
      })
      .exec();

    if (!contentWithComments) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    contentWithComments.totalComments = contentWithComments.comments.length;

    return contentWithComments;
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

  async updateViews(contentId: string, userId: string): Promise<any> {
    const content = await this.contentModel.findById(contentId);
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    if (!content.views.includes(userId)) {
      content.views.push(userId);
      await content.save();
    }
    return content;
  }

}
