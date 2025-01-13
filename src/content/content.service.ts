import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content, ContentDocument } from './schemas/content.schema';
import { Model } from 'mongoose';
@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
  ) {}

  async create(contentDto: CreateContentDto): Promise<Content> {
    const newContent = new this.contentModel(contentDto);
    return newContent.save();
  }

  async findAll(): Promise<Content[]> {
    return this.contentModel.find().exec();
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException('Content not found');
    }
    return content;
  }

  async updateById(id: string, content: Content): Promise<Content> {
    return await this.contentModel.findByIdAndUpdate(id, content, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Content> {
    return await this.contentModel.findByIdAndDelete(id);
  }
}
