import { Controller, Delete, Get } from '@nestjs/common';

@Controller('friends')
export class FriendController {
  @Get()
  getFriend() {}

  @Delete(':friendId')
  unfriend() {}
}
