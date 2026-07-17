import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { HashModule } from '@/infrastructure/hash/hash.module';
import { UploadModule } from '@/infrastructure/upload/upload.module';
import { FriendModule } from '@/friend/friend.module';

@Module({
  imports: [HashModule, UploadModule, FriendModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
