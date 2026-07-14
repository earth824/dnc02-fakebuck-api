import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponseDto } from '@/common/dto/message-response.dto';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';

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
  async cancelRequest(
    @CurrentUser('sub') currentUserId: string,
    @Param('recipientId', ParseUUIDPipe) recipientId: string
  ): Promise<MessageResponseDto> {
    await this.friendRequestService.deleteRequest(currentUserId, recipientId);
    return { message: 'The request has been cancelled' };
  }

  @HttpCode(HttpStatus.OK)
  @Post(':requesterId/accept')
  async acceptRequest(
    @CurrentUser('sub') currentUserId: string,
    @Param('requesterId', ParseUUIDPipe) requesterId: string
  ): Promise<MessageResponseDto> {
    await this.friendRequestService.acceptRequest(requesterId, currentUserId);
    return { message: 'The request has been accepted' };
  }

  @Post(':requesterId/reject')
  async rejectRequest(
    @CurrentUser('sub') currentUserId: string,
    @Param('requesterId', ParseUUIDPipe) requesterId: string
  ): Promise<MessageResponseDto> {
    await this.friendRequestService.deleteRequest(requesterId, currentUserId);
    return { message: 'The request has been rejected' };
  }

  @Get('incoming')
  async getIncomingRequest(
    @CurrentUser('sub') currentUserId: string
  ): Promise<UserResponseDto[]> {
    return this.friendRequestService.getIncomingRequest(currentUserId);
  }

  @Get('outgoing')
  getOutgoingRequest() {}
}
