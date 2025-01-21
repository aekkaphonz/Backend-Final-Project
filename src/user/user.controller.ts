import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() //ตอนยิงใช้ URL path http://localhost:3001/user method Get
  getAllUsers() {
    return this.userService.findAll();
  }

  @Post('/register') //ตอนยิงใช้ URL path http://localhost:3001/user/register method Post
  create(@Body() registerDto: RegisterDto) {
    return this.userService.create(registerDto);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/profile') //ตอนยิงใช้ URL path http://localhost:3001/user/profile method Get
  async getProfile(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email);
    return user;
  }

  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/user/<id> method Get
  async getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser(userId);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const base64Image = file.buffer.toString('base64');
    return { msg : 'image upload successfully', image : base64Image}
  }
  
}
