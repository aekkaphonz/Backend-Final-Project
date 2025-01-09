import { Controller, Post, Request, UseGuards, Res, Get,  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';


import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const { accessToken } = await this.authService.login(req.user);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    return { message: 'Login successful' };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {

  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const { accessToken } = await this.authService.googleLogin(req);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
    });
    res.redirect('/user/profile');
  }

  @Get('logout')
  async logout(@Request() req, @Res() res: Response) {
    res.clearCookie('jwt token', {
      httpOnly: true,
    });
    return res.json({ message: 'Successfully logged out' });
  }
}
