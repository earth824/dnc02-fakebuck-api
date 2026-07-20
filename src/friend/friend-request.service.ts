import { PrismaClientKnownRequestError } from '@/database/generated/prisma/internal/prismaNamespace';
import { PrismaService } from '@/database/prisma.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';
import { UserService } from '@/user/user.service';
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

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

  async deleteRequest(requesterId: string, recipientId: string): Promise<void> {
    const { count } = await this.prisma.friend.deleteMany({
      where: {
        status: 'PENDING',
        requesterId,
        OR: [{ userAId: recipientId }, { userBId: recipientId }]
      }
    });

    if (count === 0) {
      throw new NotFoundException(
        'The relationship between these two users cannot be found'
      );
    }
  }

  async acceptRequest(requesterId: string, recipientId: string): Promise<void> {
    const { count } = await this.prisma.friend.updateMany({
      data: { status: 'ACCEPTED', friendSince: new Date() },
      where: {
        status: 'PENDING',
        requesterId,
        OR: [{ userAId: recipientId }, { userBId: recipientId }]
      }
    });

    if (count === 0) {
      throw new NotFoundException(
        'The relationship between these two users cannot be found'
      );
    }
  }

  async getIncomingRequest(recipientId: string): Promise<UserResponseDto[]> {
    const result = await this.prisma.friend.findMany({
      where: {
        status: 'PENDING',
        requesterId: {
          not: recipientId
        },
        userAId: recipientId
      },
      select: {
        requester: {
          omit: { password: true }
        }
      }
    });

    return result.map((el) => el.requester);
  }

  async getOutgoingRequest(requesterId: string): Promise<UserResponseDto[]> {
    const result = await this.prisma.friend.findMany({
      where: {
        status: 'PENDING',
        requesterId,
        userAId: requesterId
      },
      select: {
        userB: {
          omit: { password: true }
        }
      }
    });

    return result.map((el) => el.userB);
  }

  async getRelationUser(targetUserId: string): Promise<UserResponseDto[]> {
    const result = await this.prisma.friend.findMany({
      where: {
        userAId: targetUserId
      },
      select: {
        userB: {
          omit: { password: true }
        }
      }
    });

    return result.map((el) => el.userB);
  }

  async getSuggestionFriend(targetUserId: string): Promise<UserResponseDto[]> {
    const relationUsers = await this.getRelationUser(targetUserId);
    const suggestionUsers = await this.userService.getUserByExcludeId([
      ...relationUsers.map((user) => user.id),
      targetUserId
    ]);
    return suggestionUsers;
  }
}

// const a = new A(); // new A(instance of B)
// const b = new B(); // new B(instance of A)
