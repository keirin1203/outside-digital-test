import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService
  ){}

  @Post('signin')
  signin(@Body() createUserDto: CreateUserDto){
    return this.authService.signin(createUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto)
  }

  @Post('logout')
  logout(@Request() request: any){
    return this.authService.logout(request.headers.authorization)
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@Request() request: any){
    return this.authService.refresh(request.user.id)
  }
}
