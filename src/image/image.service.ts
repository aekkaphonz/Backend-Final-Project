import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageStorage, imageStorageDocument } from './schemas/image.schema';
import mongoose, { Model } from 'mongoose';
import * as fs from 'fs';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(ImageStorage.name)
    private imageModel: mongoose.Model<imageStorageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async uploadImages(
    userId: string,
    files: Array<Express.Multer.File>,
  ): Promise<ImageStorage> {
   
    let imageStorage = await this.imageModel.findOne({ userId });
  
    if (!imageStorage) {
      imageStorage = new this.imageModel({ userId, profileImage: [] });
      await imageStorage.save();
    }
  
    const images: string[] = files.map((file) => {
      const fileData = fs.readFileSync(file.path);
      return fileData.toString('base64');
    });
  
    imageStorage.profileImage = images;
    await imageStorage.save();
  
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { profileImage: images } },
      { new: true },
    );
  
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    return imageStorage;
  }
  
}
