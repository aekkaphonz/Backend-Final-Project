import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { SessionSerializer } from './session.serializer';
@Module({
  imports: [UserModule, PassportModule,
    // JwtModule.registerAsync({
    //   imports: [ConfigModule], 
    //   useFactory: async (configService: ConfigService) => ({
    //     secret: configService.get('JWT_SECRET'), 
    //     signOptions: { expiresIn: '60m' },
    //   }),
    //   inject: [ConfigService], 
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy,GoogleStrategy,SessionSerializer],
})
export class AuthModule {}