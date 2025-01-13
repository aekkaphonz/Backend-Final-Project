import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './schemas/content.schema';
import mongoose, { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(contentDto: CreateContentDto): Promise<Content> {
    const newContent = new this.contentModel(contentDto);
    console.log(newContent);
    return newContent.save();
  }

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }
  async findById(id: string): Promise<Content> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('please enter correct id.');
    }

    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    // const contentObject = content.toObject(); 
    // delete contentObject.userId;
    return content; 
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

  async getUserWithContents(userId: string) {
    return this.userModel.findById(userId).populate('content').exec();
  }

  async createContent(
    userId: string,
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
    console.log('Updated User:', user);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return savedContent;
  }
}
