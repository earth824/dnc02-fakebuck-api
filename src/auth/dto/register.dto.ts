import { Trim } from '@/common/decorators/trim.decorator';
import { Gender } from '@/database/generated/prisma/enums';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  lastName: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  @Trim()
  dob: Date;

  @IsEnum(Gender)
  @IsNotEmpty()
  @Trim()
  gender: Gender;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsAlphanumeric()
  @IsString()
  @IsNotEmpty()
  password: string;
}
