import { PrismaService } from '@/database/prisma.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RelationshipStatus } from './types/friend.type';

@Injectable()
export class FriendService {
  constructor(private readonly prisma: PrismaService) {}

  async getFriend(userId: string): Promise<UserResponseDto[]> {
    const result = await this.prisma.friend.findMany({
      where: {
        status: 'ACCEPTED',
        userAId: userId
      },
      select: {
        userB: {
          omit: {
            password: true
          }
        }
      }
    });

    return result.map((el) => el.userB);
  }

  async unfriend(userId: string, friendId: string): Promise<void> {
    const { count } = await this.prisma.friend.deleteMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { userAId: userId, userBId: friendId },
          { userAId: friendId, userBId: userId }
        ]
      }
    });

    if (count === 0) {
      throw new NotFoundException(
        'These two users have never become friend together'
      );
    }
  }

  async getRelationshipBetweenUser(
    currentUserId: string,
    targetUserId: string
  ): Promise<RelationshipStatus> {
    if (currentUserId === targetUserId) {
      return 'SELF';
    }

    const relationship = await this.prisma.friend.findFirst({
      where: {
        userAId: currentUserId,
        userBId: targetUserId
      }
    });

    if (!relationship) {
      return 'NONE';
    }

    if (relationship.status === 'ACCEPTED') {
      return 'FRIEND';
    }

    if (relationship.requesterId === currentUserId) {
      return 'REQUEST_SENT';
    }

    return 'REQUEST_RECIEVED';
  }
}
