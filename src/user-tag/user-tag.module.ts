import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TagModule } from 'src/tag/tag.module';
import { UserModule } from 'src/user/user.module';
import { UserTagController } from './user-tag.controller';
import { UserTagService } from './user-tag.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TagModule
  ],
  controllers: [UserTagController],
  providers: [UserTagService]
})
export class UserTagModule {}
