import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './schemas/posts.schemas';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) { }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      id,
      updatePostDto,
      { new: true },
    );
    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return updatedPost;
  } 

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post> {
    return this.postModel.findById(id).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0; // true หากลบสำเร็จ
  }

  async countPostsByAuthor(authorId: string): Promise<number> {
    return this.postModel.countDocuments({ userId: authorId }).exec();
  }

  async incrementView(postId: string): Promise<Post> {
    return this.postModel
      .findByIdAndUpdate(postId, { $inc: { viewCount: 1 } }, { new: true })
      .exec();
  }

  async incrementLike(postId: string): Promise<Post> {
    return this.postModel
      .findByIdAndUpdate(postId, { $inc: { likeCount: 1 } }, { new: true })
      .exec();
  }
  
  async findByUserId(userId: string): Promise<Post[]> {
    return this.postModel.find({ userId }).exec();
  }  

}
