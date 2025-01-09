import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, photos } = profile;
    const { givenName, familyName } = profile.name || {}; // Add a fallback to an empty object

    const user = {
      googleId: id,
      email: emails[0].value,
      name: `${givenName} ${familyName}`,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}

// เพิ่ม auth/google-auth.guard.ts เพื่อให้เรียกใช้งานใน Controller ได้

import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}