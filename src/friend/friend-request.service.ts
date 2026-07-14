import { PrismaClientKnownRequestError } from '@/database/generated/prisma/internal/prismaNamespace';
import { PrismaService } from '@/database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class FriendRequestService {
  constructor(private readonly prisma: PrismaService) {}

  async sendRequest(requesterId: string, recipientId: string): Promise<void> {
    if (requesterId === recipientId) {
      throw new BadRequestException('You cannot send a request to yourself');
    }

    try {
      await this.prisma.friend.createMany({
        data: [
          {
            userAId: requesterId,
            userBId: recipientId,
            requesterId,
            status: 'PENDING'
          },
          {
            userAId: recipientId,
            userBId: requesterId,
            requesterId,
            status: 'PENDING'
          }
        ]
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'These users already have a relationship'
          );
        }

        if (error.code === 'P2003') {
          throw new NotFoundException(
            'The recipient user or requester user not found'
          );
        }
      }

      throw error;
    }
  }
}
