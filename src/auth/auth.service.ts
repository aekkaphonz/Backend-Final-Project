import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/user/dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,

    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException(
        'This email is already registered.',
      );
    }

    const newUser = new this.userModel(registerDto);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    console.log('user', user);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user.toObject();

      return {
        email: result.email,
        userId: result._id,
      };
    }
    return null;
  }

  async googleLogin(req: any): Promise<any> {
    if (!req.user) {
      throw new Error('Google login failed: No user information received.');
    }

    const { email, name, picture, googleId } = req.user;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        userName: name || 'Google User',
        gender: null,
        dateOfBirth: null,
        googleId,
      });
      await user.save();
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      userName: user.userName,
    };

    return { message: 'Login successful', user: req.session.user };
  }
}

// async login(user: any) {
//   const payload = { email: user.email, sub: user.userId };
//   return {
//     accessToken: this.jwtService.sign(payload),
//   };
// }
//
// //  google
// async googleLogin(req): Promise<any> {
//   if (!req.user) {
//     throw new Error('Google login failed: No user information received.');
//   }

//   const { email, name, picture, googleId } = req.user;
//   let user = await this.userModel.findOne({ email });

//   if (!user) {
//     user = new this.userModel({
//       email,
//       userName: name || 'Google User',
//       gender: null,
//       dateOfBirth: null,
//       googleId,
//     });
//     await user.save();
//   }

//   const payload = { email: user.email };

//   return {
//     accessToken: this.jwtService.sign(payload),
//   };
// }
