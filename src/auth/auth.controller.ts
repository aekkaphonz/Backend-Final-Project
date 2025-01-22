import { Controller, Post, Request, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';

import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login') //ตอนยิงใช้ URL path http://localhost:3001/auth/login method Post
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { accessToken } = await this.authService.login(req.user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    return { message: 'Login successful' };
  }

  @Get('google') //ตอนยิงใช้ URL path http://localhost:3001/auth/google method Get
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth(@Request() req) {}

  @Get('google/callback') //ตอนยิงใช้ URL path http://localhost:3001/auth/google/callback method Get
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    res.redirect('http://localhost:3001/user/profile');
  }

  @Get('logout') //ตอนยิงใช้ URL path http://localhost:3001/auth/logout method Get
  async logout(@Request() req, @Res() res: Response) {
    res.clearCookie('jwt_token', {
      httpOnly: true,
    });
    
    return res.redirect('http://localhost:3000');
  }
}
