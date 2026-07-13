import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { BcryptService } from '@/infrastructure/hash/bcrypt.service';
import { AccessTokenService } from './access-token.service';
import { UserResponseDto } from '@/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    await this.userService.createUser(dto);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await this.bcryptService.compare(
      dto.password,
      user.password
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = await this.accessTokenService.sign({
      sub: user.id,
      email: user.email
    });

    return { access_token };
  }

  async getMe(id: string): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
