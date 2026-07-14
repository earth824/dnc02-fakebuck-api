import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';

@Controller('friends/request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post(':recipientId')
  async sendRequest(
    @CurrentUser('sub') currentUserId: string,
    @Param('recipientId', ParseUUIDPipe) recipientId: string
  ): Promise<MessageResponseDto> {
    await this.friendRequestService.sendRequest(currentUserId, recipientId);
    return { message: 'The request has been sent' };
  }

  @Delete(':recipientId')
  cancelRequest() {}

  @Post(':requesterId/accept')
  acceptRequest() {}

  @Post(':requesterId/reject')
  rejectRequest() {}

  @Get('incoming')
  getIncomingRequest() {}

  @Get('outgoing')
  getOutgoingRequest() {}
}
