//  @ApiOperation({ summary: 'Update content' })
//   @ApiOkResponse({ type: [GetContentDto] })
//   @Put(':id') //ตอนยิงใช้ URL path http://localhost:3001/contents/<id> method Put
//   async updateContent(
//     @Param('id')
//     id: string,
//     @Body()
//     content: UpdateContentDto,
//   ): Promise<Content> {
//     return this.contentService.updateById(id, content);
//   }

//   @Post('/createContent')
//     async createContent(@Body() createContentDto: CreateContentDto) {
//       console.log('Received Data:', createContentDto);
//       return this.contentService.createContent(createContentDto);
//     }


// @ApiOperation({ summary: 'Create content' })
// @ApiOkResponse({ type: [CreateContentDto] })
// @Post('/createContent') //ตอนยิงใช้ URL path http://localhost:3001/contents/createContent
// async createContent(
//   @Body('userId') userId: string,
//   @Body('title') title: string,
//   @Body('detail') detail: string,
//   @Body('description') description: string,
//   @Body('image') image: string,
// ) {
//   return this.contentService.createContent(
//     userId,
//     title,
//     detail,
//     description,
//     image,
//   );
// }