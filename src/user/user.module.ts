import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ContentModule } from 'src/content/content.module';
import { ReplyModule } from 'src/reply/reply.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => ContentModule),
    forwardRef(() => ReplyModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
