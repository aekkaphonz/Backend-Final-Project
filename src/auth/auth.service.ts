import { Injectable } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  //  google 
  async googleLogin(req): Promise<any> {
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

    const payload = { email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
