import { forwardRef, Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { FriendService } from './friend.service';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [FriendController, FriendRequestController],
  providers: [FriendRequestService, FriendService],
  exports: [FriendService]
})
export class FriendModule {}
