import { RelationshipStatus } from '@/friend/types/friend.type';
import { UserResponseDto } from './user-response.dto';

export class UserProfileResponseDto {
  user: UserResponseDto;

  friends: UserResponseDto[];

  relationshipStatus: RelationshipStatus;
}
