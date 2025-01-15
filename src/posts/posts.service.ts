import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/posts.schemas';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<CreatePostDto>): Promise<Post> {
    return this.postModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0; // true หากลบสำเร็จ
  }

  async countPostsByAuthor(authorId: string): Promise<number> {
    return this.postModel.countDocuments({ authorId }).exec();
  }
  
}
