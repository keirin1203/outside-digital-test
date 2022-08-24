import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import Blacklist from './entities/blacklist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

    @InjectRepository(Blacklist)
    private blacklistRepository: Repository<Blacklist>
  ){}

  async signin(createUserDto: CreateUserDto){
    const {email, password, nickname} = createUserDto

    const hashPassword: string = await bcrypt.hash(password, 10)

    const user = await this.userService.create({
      email: email,
      password: hashPassword,
      nickname: nickname
    })

    return await this.getToken(user)
  }

  async login(loginUserDto: LoginUserDto){
    const user = await this.validateUser(
      loginUserDto.email, 
      loginUserDto.password
    )
    if (!user) throw new UnauthorizedException({message: 'Неверный логин или пароль'})
    return this.getToken(user)
  }

  async logout(rawToken: string){
    const token = rawToken.split(' ')[1]
    await this.blacklistRepository.save({
      token: token
    })
  }

  async refresh(id: string) {
    const user = await this.userService.findOneById(id)
    return this.getToken(user)
  }

  async checkBlacklist(token: string): Promise<boolean> {
    const result = await this.blacklistRepository.findOneBy({ token: token });
    console.log(result)
    return result ? true : false
  }

  async getToken(user: User) {
    const token = await this.jwtService.signAsync({
      id: user.id,
      nickname: user.nickname
    })
    return {
      token: token,
      expire: process.env.JWT_EXPIRES_IN
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email)
    if (!user) throw new UnauthorizedException({message: 'Пользователь не существует'})

    const passwordEquals = await bcrypt.compare(password, user.password)

    if (user && passwordEquals) return user
  }
}
