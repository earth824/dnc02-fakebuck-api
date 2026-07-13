import { Gender } from '@/database/generated/prisma/enums';

export type UserCreateInput = {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: Gender;
  email: string;
  password: string;
  avatarUrl?: string;
  coverUrl?: string;
};
