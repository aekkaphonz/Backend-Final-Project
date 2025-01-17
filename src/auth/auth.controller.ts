import {
  Controller,
  Post,
  Request,
  UseGuards,
  Res,
  Get,
  Session,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

import { Response } from 'express';
import { session } from 'passport';
import { User, UserDocument } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto, RegisterResponseDto } from 'src/user/dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './authenticated.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @ApiOperation({ summary: 'Use to create new user' })
  @ApiCreatedResponse({
    description: 'User created',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad payload sent' })
  @Post('/register') //ตอนยิงใช้ URL path http://localhost:3001/auth/register method Post
  create(@Body() registerDto: RegisterDto) {
    console.log('Received Data:', registerDto);
    return this.authService.create(registerDto);
  }

  @ApiOperation({ summary: 'Use to login' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const user = req.session.user;
    if (!user) {
      return { message: 'Login failed', error: 'No user session found' };
    }
    console.log('User email:', user);
    return { message: 'Login successful', user };
  }

  @ApiOperation({ summary: 'Use to check auth' })
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  profile(@Request() req) {
    return {
      msg: 'You an authorize user',
      user: req.user,
    };
  }

  @ApiOperation({ summary: 'Google login' })
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Request() req) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    if (!req.user) {
      return res.status(403).send({ message: 'Forbidden resource' });
    }

    req.session.user = req.user;
    console.log('User stored in session:', req.session.user);
    res.redirect('http://localhost:3001/user/profile');
  }

  @ApiOperation({ summary: 'Use to logout' })
  @Post('logout')
  logout(@Request() req) {
    req.session.destroy();
    return { msg: 'your session has been destroyed' };
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('login') //ตอนยิงใช้ URL path http://localhost:3001/auth/login method Post
  // async login(@Request() req, @Res({ passthrough: true }) res) {
  //   const { accessToken } = await this.authService.login(req.user);
  //   res.cookie('access_token', accessToken, {
  //     httpOnly: true,
  //   });
  //   return { message: 'Login successful' };
  // }

  // @Get('google') //ตอนยิงใช้ URL path http://localhost:3001/auth/google method Get
  // @UseGuards(GoogleAuthGuard)
  // async googleAuth(@Request() req) {}

  // @Get('google/callback') //ตอนยิงใช้ URL path http://localhost:3001/auth/google/callback method Get
  // @UseGuards(GoogleAuthGuard)
  // async googleAuthRedirect(@Request() req, @Res() res: Response) {
  //   const { accessToken } = await this.authService.googleLogin(req);
  //   res.cookie('access_token', accessToken, {
  //     httpOnly: true,
  //   });
  //   res.redirect('http://localhost:3001/user/profile');
  // }

  // @Get('logout') //ตอนยิงใช้ URL path http://localhost:3001/auth/logout method Get
  // async logout(@Request() req, @Res() res: Response) {
  //   res.clearCookie('jwt_token', {
  //     httpOnly: true,
  //   });

  //   return res.redirect('http://localhost:3000');
  // }
}
