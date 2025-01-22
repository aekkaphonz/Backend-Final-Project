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
  Patch,
  Put,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { GetUserDto } from './dto/getuser.dto';
import * as multer from 'multer';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @ApiOkResponse({ type: [GetUserDto] })
  @Get() //ตอนยิงใช้ URL path http://localhost:3001/user method Get
  getAllUsers() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Use to check your profile' })
  @ApiOkResponse({ type: [GetUserDto] })
  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  async getProfile(@Request() req) {
    try {
      const user = await this.userService.findByEmail(req.user.email);

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const populatedUser = await this.userService.getOneUser(
        user._id.toString(),
      );

      if (!populatedUser) {
        throw new NotFoundException('User with content not found.');
      }

      return [populatedUser];
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      throw new InternalServerErrorException('Failed to fetch profile.');
    }
  }

  // เผื่อใช้
  //   @ApiOperation({ summary: 'Use to check your profile' })
  //   @ApiOkResponse({ type: [GetUserDto] })
  //   @UseGuards(AuthenticatedGuard)
  //   @Get('/profile')
  //   async getProfile(@Request() req) {
  //     const user = await this.userService.findByEmail(req.user.email);
  //     return [user];
  //   }

  @ApiOperation({ summary: 'Use to check other profile' })
  @ApiOkResponse({ type: [GetUserDto] })
  @Get(':id') //ตอนยิงใช้ URL path http://localhost:3001/user/:id method Get
  async getOneUser(@Param('id') userId: string) {
    return this.userService.getOneUser(userId);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profileImage'))
  async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateUserDto: Partial<User>,
  ) {
    if (file) {
      const base64Image = file.buffer.toString('base64');
      const mimeType = file.mimetype;

      updateUserDto.profileImage = `data:${mimeType};base64,${base64Image}`;
    } else {
      const existingUser = await this.userService.findByEmail(id);
      if (existingUser && existingUser.profileImage) {
        updateUserDto.profileImage = existingUser.profileImage;
      }
    }

    return this.userService.updateUser(id, updateUserDto);
  }
 
  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse({ description: 'Delete successfully' })
  @Delete(':id')
  async deleteUser(
    @Param('id')
    id: string,
  ): Promise<User> {
    return this.userService.deleteUserById(id);
  }
}
