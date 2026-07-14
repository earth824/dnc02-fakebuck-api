import {
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(FileInterceptor('avatar'))
  @Patch('me/avatar')
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('sub') userId: string
  ): Promise<string> {
    return this.userService.uploadAvatar(userId, file);
  }

  @UseInterceptors(FileInterceptor('cover'))
  @Patch('me/cover')
  uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('sub') userId: string
  ): Promise<string> {
    return this.userService.uploadCover(userId, file);
  }

  @Get(':userId/profile')
  getUserProfile() {}
}

// FileInterceptor: single field => single file (@UploadedFile)
// FilesInterceptor: single field => multiple files (@UploadedFiles)
// FileFieldsInterceptor: multiple fields => multiple files (@UploadedFiles)
