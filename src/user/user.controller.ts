import { Controller, Get, Patch } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Patch('me/avatar')
  uploadAvatar() {}

  @Patch('me/cover')
  uploadCover() {}

  @Get(':userId/profile')
  getUserProfile() {}
}
