import { forwardRef, Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content , ContentSchema} from './schemas/content.schema';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
@Module({
   imports: [
      MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
      forwardRef(() => UserModule),
      forwardRef(() => CommentModule),
    ],
  controllers: [ContentController],
  providers: [ContentService],
  exports:[ContentService,MongooseModule ],
})
export class ContentModule {}
