import { Gender } from '@/database/generated/prisma/enums';

export class UserResponseDto {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  dob: Date;

  gender: Gender;

  avatarUrl: string | null;

  coverUrl: string | null;

  createdAt: Date;

  updatedAt: Date;
}
