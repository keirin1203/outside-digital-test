import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Blacklist from './entities/blacklist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blacklist]),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: +process.env.JWT_EXPIRES_IN * 1000
      }
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [
    JwtModule,
    AuthModule,
    AuthService
  ]
})
export class AuthModule {}
