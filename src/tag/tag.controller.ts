import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() request, @Body() createTagDto: CreateTagDto) {
    return this.tagService.create(request.user.id, createTagDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.tagService.findOneById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getByOptions(
    @Query('sortByOrder') sortByOrder?: boolean,
    @Query('sortByName') sortByName?: boolean,
    @Query('offset') offset?: number,
    @Query('length') length?: number,
  ) {
    return this.tagService.getByOptions(
      sortByOrder = sortByOrder === undefined ? false : true,
      sortByName = sortByName === undefined ? false : true,
      offset,
      length
    )
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async put(
    @Param('id') id: number, 
    @Body() updateTagDto: UpdateTagDto,
    @Request() request,
    ) {
      const isCreator = await this.tagService.checkCreator(id, request.user.id)
      if (!isCreator) throw new UnauthorizedException({message: 'Тэг может менять только владелец'})

      return this.tagService.update(id, updateTagDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number, @Request() request,) {
    const isCreator = await this.tagService.checkCreator(id, request.user.id)
    if (!isCreator) throw new UnauthorizedException({message: 'Тэг может менять только владелец'})

    return this.tagService.delete(id)
  }
}
