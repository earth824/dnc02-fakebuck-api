import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendRequestController } from './friend-request.controller';

@Module({
  controllers: [FriendController, FriendRequestController]
})
export class FriendModule {}
