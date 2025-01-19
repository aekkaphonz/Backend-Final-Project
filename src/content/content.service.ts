import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './schemas/content.schema';
import  { Model, Types } from 'mongoose';
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

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }
 
  async updateById(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    if (updateContentDto.userId) {
      updateContentDto.userId = new Types.ObjectId(updateContentDto.userId);
    }

    const updatedContent = await this.contentModel
      .findByIdAndUpdate(id, updateContentDto, {
        new: true,
      })
      .exec();

    if (!updatedContent) {
      throw new Error('Content not found');
    }

    return updatedContent;
  }

  async deleteById(id: string): Promise<Content> {
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

  async createContent(
    userId: string, // token : string ยังไม่มีฟังก์ชันแปลง token JWT to userId
    title: string,
    detail: string,
    description: string,
    image: string,
  ): Promise<Content> {
    const newContent = new this.contentModel({
      userId,
      title,
      detail,
      description,
      image,
    });

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
  }

  async findById(id: string): Promise<Content> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) {
      throw new BadRequestException('Please provide a valid ID.');
    }
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

   //  เผื่อต้องใช้
  // async findById(id: string): Promise<Content> {
  //   const isValidId = mongoose.isValidObjectId(id);
  //   if (!isValidId) {
  //     throw new BadRequestException('please enter correct id.');
  //   }

  //   const content = await this.contentModel.findById(id).exec();
  //   if (!content) {
  //     throw new NotFoundException('Content not found');
  //   }
  //    const contentObject = content.toObject();
  //    delete contentObject.userId;
  //   return content;
  // }
}
