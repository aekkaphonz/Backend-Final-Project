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
  ) { }

  async create(contentDto: CreateContentDto): Promise<Content> {
    const newContent = new this.contentModel(contentDto);
    console.log(newContent);
    return newContent.save();
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
    let { userId, title, detail, description, postImage, tags } = createContentDto;

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

  async findAllByUserId(userId: string): Promise<Content[]> {
    console.log("👉 userId in findAllByUserId:", userId); // Debug userId
    const contents = await this.contentModel.find({ userId }).exec();
    console.log("✅ Found contents:", contents); // Debug ผลลัพธ์ที่ดึงได้
    return contents;
  }

  async searchByTitle(search: string) {
    return this.contentModel.find({ title: new RegExp(search, 'i') }).exec();
  }

  // 🔍 ค้นหาตาม `_id`
  async getById(id: string) {
    console.log(`🔍 Searching by ID: ${id}`); // Debugging
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException('Content not found.');
    }
    return content;
  }

  // 🔍 ค้นหาตาม `title`
  async getByTitle(title: string) {
    console.log(`🔍 Searching by title: ${title}`); // Debugging
    const content = await this.contentModel.findOne({ title: new RegExp(`^${title}$`, 'i') }).exec();
    if (!content) {
      throw new NotFoundException('Content with this title not found.');
    }
    return content;
  }

  async searchContents(searchQuery: string) {
    return this.contentModel.find({
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { detail: { $regex: searchQuery, $options: "i" } },
      ],
    });
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

  async findByTag(tag: string): Promise<Content[]> {
    const contents = await this.contentModel
      .find({ tags: tag })  // ค้นหาบทความที่มี tag ตรงกับค่าที่ส่งมา
      .exec();

    if (contents.length === 0) {
      throw new NotFoundException(`No content found with the tag ${tag}`);
    }

    return contents;
  }


}
