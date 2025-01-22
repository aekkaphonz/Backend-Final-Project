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
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetUserDto } from './dto/getuser.dto';
import * as multer from 'multer';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @ApiOperation({ summary: 'Get all user' })
  @ApiOkResponse({type : [GetUserDto] })
  @Get() //ตอนยิงใช้ URL path http://localhost:3001/user method Get
  getAllUsers() {
    return this.userService.findAll();
  }

  // @ApiOperation({ summary: 'Use to check logged-in user profile' })
  // @ApiOkResponse({ type: GetUserDto })
  // @Get('profile') 
  // async getLoggedInUserProfile(@Req() req: Request) {
    
  //   const userId = req.session?.userId; 
  //   if (!userId) {
  //     throw new Error('User not logged in');
  //   }

    
  //   return this.userService.getOneUser(userId);
  // }

  @ApiOperation({ summary: 'Use to check your profile' })
  @ApiOkResponse({type : [GetUserDto] })
  @UseGuards(AuthenticatedGuard)
  @Get('/profile') 
  async getProfile(@Request() req) {
    const user = await this.userService.findByEmail(req.user.email);
    return [user];
  }

  @ApiOperation({ summary: 'Use to check other profile' })
  @ApiOkResponse({type : [GetUserDto] })
  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/user/:id method Get
  async getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser(userId);
  }




  // @Post('image')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   const base64Image = file.buffer.toString('base64');
  //   return { msg : 'image upload successfully', image : base64Image}
  // }
  
}


  // @Post('/register') //ตอนยิงใช้ URL path http://localhost:3001/user/register method Post
  // create(@Body() registerDto: RegisterDto) {
  //   return this.userService.create(registerDto);
  // }