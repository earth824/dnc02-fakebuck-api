import { Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('me/avatar')
  uploadAvatar() {}

  @Patch('me/cover')
  uploadCover() {}

  @Get(':userId/profile')
  getUserProfile() {}
}

// FileInterceptor: single field => single file
// FilesInterceptor: single field => multiple files
// FileFieldsInterceptor: multiple fields => multiple files
