import { ConflictException, Injectable } from '@nestjs/common';
import { UserCreateInput } from './types/user.type';
import { BcryptService } from '@/infrastructure/hash/bcrypt.service';
import { PrismaService } from '@/database/prisma.service';
import {
  PrismaClientKnownRequestError,
  UserGetPayload
} from '@/database/generated/prisma/internal/prismaNamespace';
import { User } from '@/database/generated/prisma/client';
import { CloudinaryService } from '@/infrastructure/upload/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async createUser(input: UserCreateInput): Promise<void> {
    const hash = await this.bcryptService.hash(input.password);

    try {
      await this.prisma.user.create({ data: { ...input, password: hash } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exist');
        }
      }
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getUserById(
    id: string
  ): Promise<UserGetPayload<{ omit: { password: true } }> | null> {
    return this.prisma.user.findUnique({
      where: { id },
      omit: { password: true }
    });
  }

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    const avatarUrl = await this.cloudinaryService.upload(file);
    await this.prisma.user.update({
      data: { avatarUrl },
      where: { id: userId }
    });
    return avatarUrl;
  }

  async uploadCover(
    userId: string,
    file: Express.Multer.File
  ): Promise<string> {
    const coverUrl = await this.cloudinaryService.upload(file);
    await this.prisma.user.update({
      data: { coverUrl },
      where: { id: userId }
    });
    return coverUrl;
  }
}
