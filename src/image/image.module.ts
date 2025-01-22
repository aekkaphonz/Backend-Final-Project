import { forwardRef, Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ImageStorage, imageStorageSchema } from './schemas/image.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageStorage.name, schema: imageStorageSchema },
    ]),
    forwardRef(() => UserModule)
  ],
  controllers: [ImageController],
  providers: [ImageService],
  exports: [ImageService,MongooseModule],
})
export class ImageModule {}
