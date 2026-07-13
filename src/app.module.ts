import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    FriendModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AppModule {}
