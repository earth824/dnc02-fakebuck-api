import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { FriendService } from './friend.service';

@Module({
  controllers: [FriendController, FriendRequestController],
  providers: [FriendRequestService, FriendService],
  exports: [FriendService]
})
export class FriendModule {}
