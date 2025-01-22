 // @Put(':id')
  // @UseInterceptors(FileInterceptor('profileImage'))
  // async updateUser(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Param('id') id: string,
  //   @Body() updateUserDto: Partial<User>,
  // ) {
  //   if (file) {
  //     const base64Image = file.buffer.toString('base64');
  //     const mimeType = file.mimetype;

  //     updateUserDto.profileImage = `data:${mimeType};base64,${base64Image}`;
  //   }

  //   return this.userService.updateUser(id, updateUserDto);
  // }


    // เผื่อใช้
    //   @ApiOperation({ summary: 'Use to check your profile' })
    //   @ApiOkResponse({ type: [GetUserDto] })
    //   @UseGuards(AuthenticatedGuard)
    //   @Get('/profile')
    //   async getProfile(@Request() req) {
    //     const user = await this.userService.findByEmail(req.user.email);
    //     return [user];
    //   }