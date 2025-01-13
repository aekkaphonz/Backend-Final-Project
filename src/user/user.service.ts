import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('อีเมลนี้ได้ลงทะเบียนแล้ว กรุณาใช้อีเมลอื่น');
    }

    const newUser = new this.userModel(registerDto);
    return newUser.save();
  }


  async findByEmail(email:string) :Promise<UserDocument>{
    return this.userModel.findOne({email}).exec();
  }
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec(); 
  }
}
