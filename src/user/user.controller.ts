import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';

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

  @Get(':targetUserId/profile')
  async getUserProfile(
    @CurrentUser('sub') currentUserId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string
  ): Promise<UserProfileResponseDto> {
    return this.userService.getUserProfile(currentUserId, targetUserId);
  }
}

// FileInterceptor: single field => single file (@UploadedFile)
// FilesInterceptor: single field => multiple files (@UploadedFiles)
// FileFieldsInterceptor: multiple fields => multiple files (@UploadedFiles)
