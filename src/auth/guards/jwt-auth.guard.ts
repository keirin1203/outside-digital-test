import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {JwtService} from "@nestjs/jwt";
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService
    ) {}

  async canActivate(context: ExecutionContext,) {
    const req = context.switchToHttp().getRequest()

    try {
      const authHeader = req.headers.authorization;
      
      const bearer = authHeader.split(' ')[0]
      const token = authHeader.split(' ')[1]

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({message: "Необходима авторизация!"})
      }

      const isInBlacklist = await this.authService.checkBlacklist(token);
      if (isInBlacklist) return false
      
      const user = this.jwtService.verify(token);
      req.user = user;

      return true
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException({message: "Необходима авторизация!"})
    }
  }
}