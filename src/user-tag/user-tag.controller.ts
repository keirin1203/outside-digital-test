import { Body, Controller, Post, UseGuards, Request, Delete, Param, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserTagDto } from './dto/user-tag.dto';
import { UserTagService } from './user-tag.service';

@Controller()
export class UserTagController {
  constructor(private readonly userTagService: UserTagService) {}

  @UseGuards(JwtAuthGuard)
  @Post('user/tag')
  addTagsToUser(@Request() request ,@Body() userTagDto: UserTagDto) {
    return this.userTagService.addTagsToUser(request.user.id, userTagDto.tags)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user/tag/:id')
  delete(@Request() request, @Param('id') tagId: number) {
    return this.userTagService.deleteTagFromUser(request.user.id, tagId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/tag/my')
  getCreatedTags(@Request() request) {
    return this.userTagService.getCreatedTags(request.user.id)
  }
}
