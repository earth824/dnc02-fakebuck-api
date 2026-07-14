import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';

@Module({
  controllers: [FriendController, FriendRequestController],
  providers: [FriendRequestService]
})
export class FriendModule {}
