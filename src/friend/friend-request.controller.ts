import { Controller, Delete, Get, Post } from '@nestjs/common';

@Controller('friends/request')
export class FriendRequestController {
  @Post()
  sendRequest() {}

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
