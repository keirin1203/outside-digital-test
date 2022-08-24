import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Request() request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(request.user.id ,updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Request() request) {
    return this.userService.delete(request.user.id);
  }
}
