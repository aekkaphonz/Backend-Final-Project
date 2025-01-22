// async createContent(createContentDto: CreateContentDto): Promise<Content> {

//   const { userId, title, detail, description, postImage } = createContentDto;

//   const newContent = new this.contentModel({
//     userId,
//     title,
//     detail,
//     description,
//     postImage,
//   });

//   const savedContent = await newContent.save();

//   const user = await this.userModel.findByIdAndUpdate(
//     userId,
//     { $push: { content: savedContent._id } },
//     { new: true },
//   );

//   if (!user) {
//     throw new NotFoundException(`User with ID ${userId} not found`);
//   }

//   return savedContent;
// }



  //  เผื่อต้องใช้
  // async findById(id: string): Promise<Content> {
  //   const isValidId = mongoose.isValidObjectId(id);
  //   if (!isValidId) {
  //     throw new BadRequestException('please enter correct id.');
  //   }

  //   const content = await this.contentModel.findById(id).exec();
  //   if (!content) {
  //     throw new NotFoundException('Content not found');
  //   }
  //    const contentObject = content.toObject();
  //    delete contentObject.userId;
  //   return content;
  // }


//   async updateById(
//       id: string,
//       updateContentDto: UpdateContentDto,
//     ): Promise<Content> {
//       if (updateContentDto.userId) {
//         updateContentDto.userId = new Types.ObjectId(updateContentDto.userId);
//       }
  
//       const updatedContent = await this.contentModel
//         .findByIdAndUpdate(id, updateContentDto, {
//           new: true,
//         })
//         .exec();
  
//       if (!updatedContent) {
//         throw new Error('Content not found');
//       }
  
//       return updatedContent;
//     }
