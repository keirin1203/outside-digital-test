import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt";
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['tags']
    });
  }

  async findOneById(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {id: id},
      relations: {
        tags: true
      }
    });
  }

  async findByNickname(nickname: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {nickname: nickname}
    })
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {email: email}
    })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    return this.usersRepository.update({id: id}, updateUserDto)
  }

  async delete(id: string) {
    return this.usersRepository.delete(id);
  }

  async addTagsToUser(userId: string, tags: Tag[]) {
    const user = await this.findOneById(userId)
    user.tags = user.tags.concat(tags)
    await this.usersRepository.save(user)

    return tags
  }

  async saveUser(user: User) {
    return this.usersRepository.save(user)
  }
}
