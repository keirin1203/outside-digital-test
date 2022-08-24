import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private userService: UserService,
  ){}

  async create(creatorId: string, createTagDto: CreateTagDto): Promise<Tag> {
    const {name, sortOrder} = createTagDto
    const creatorUser = await this.userService.findOneById(creatorId)

    let data
    if (sortOrder) {
      data = await this.tagRepository.save({
        creator: creatorUser,
        name: name,
        sortOrder: +sortOrder
      })
    } else {
      data = await this.tagRepository.save({
        creator: creatorUser,
        name: name
      })
    }
    const { creator, ...rest } = data;
    return rest
  }

  async findOneById(id: number): Promise<Tag> {
    return this.tagRepository
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.creator', 'user')
      .where('tag.id = :id', { id: id })
      .select(['user.nickname', 'user.id', 'tag.name', 'tag.sortOrder'])
      .getOne()
  }

  findById(id: number): Promise<Tag> {
    return this.tagRepository.findOne({
      where: {id: id}
    })
  }

  async getByOptions(
    sortByOrder?: boolean, 
    sortByName?: boolean,
    offset?: number,
    length?: number,
    ) {
      const orderOptions = {}
      if (sortByOrder) orderOptions['tag.sortOrder'] = 'DESC';
      if (sortByName) orderOptions['tag.name'] = 'ASC';

      const data = await this.tagRepository
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.creator', 'user')
      .select(['user.nickname', 'user.id', 'tag.name', 'tag.sortOrder'])
      .orderBy(orderOptions)
      .offset(offset)
      .limit(length)
      .getMany()

      const meta = {
        offset: offset,
        length: length,
        quantity: data.length
      }

      return {
        data: data,
        meta: meta
      }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return this.tagRepository.update({id: id}, updateTagDto)
  }

  async checkCreator(tagId: number, userId: string): Promise<Boolean> {
    const tag = await this.tagRepository.findOne({
      where: {id: tagId},
      relations: ['creator']
    })
    return tag.creator.id === userId ? true : false
  }

  async delete(id: number) {
    return this.tagRepository.delete({id: id});
  }

  async getTagsByCreator(userId: string) {
    return this.tagRepository.findBy({creator: {id: userId}})
  }
}
