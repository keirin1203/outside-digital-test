import { Injectable, NotFoundException } from '@nestjs/common';
import { filter } from 'rxjs';
import { Tag } from 'src/tag/entities/tag.entity';
import { TagService } from 'src/tag/tag.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserTagService {
  constructor(
    private tagService: TagService,
    private userService: UserService
  ){}

  async addTagsToUser(userId: string, tagsId: number[]) {
    let tags = []

    for(let item of tagsId) {
      const tag = await this.tagService.findById(item)
      if (!tag) throw new NotFoundException({message: `Тэга с id=${item} не существует`})
      tags.push(tag)
    }

    return this.userService.addTagsToUser(userId, tags)
  }

  async deleteTagFromUser(userId: string, tagId: number) {
    const user = await this.userService.findOneById(userId)

    user.tags = user.tags.filter(item => item.id != tagId)
    await this.userService.saveUser(user)

    return user.tags
  }

  async getCreatedTags(userId: string) {
    return await this.tagService.getTagsByCreator(userId)
  }
}
