import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import 'dotenv/config'
import { User } from './user/entities/user.entity';
import { Tag } from './tag/entities/tag.entity';
import { AuthModule } from './auth/auth.module';
import { UserTagModule } from './user-tag/user-tag.module';
import Blacklist from './auth/entities/blacklist.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Tag, Blacklist],
      synchronize: true,
      logging: true,
      logger: 'advanced-console'
    }),

    UserModule,

    TagModule,

    AuthModule,

    UserTagModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
