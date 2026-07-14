import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { FriendService } from './friend.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async getFriend(
    @CurrentUser('sub') currentUserId: string
  ): Promise<UserResponseDto[]> {
    return this.friendService.getFriend(currentUserId);
  }

  @Delete(':friendId')
  async unfriend(
    @CurrentUser('sub') currentUserId: string,
    @Param('friendId', ParseUUIDPipe) friendId: string
  ): Promise<MessageResponseDto> {
    await this.friendService.unfriend(currentUserId, friendId);
    return { message: 'Friend terminated' };
  }
}
