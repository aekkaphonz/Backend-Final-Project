import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseFilePipeBuilder, UploadedFiles, UseInterceptors, Put, UseGuards } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}


  @Put('upload/:userId')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FilesInterceptor('files')) 
  async uploadImages( 
    @Param('userId') userId: string,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/, 
        })
        .addMaxSizeValidator({
          maxSize: 1000 * 1000,  
          message: 'File size must be less than 1MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,  
        }),
    )
    files: Array<Express.Multer.File>, 
  ) {
    return this.imageService.uploadImages(userId, files);  
  }
}
