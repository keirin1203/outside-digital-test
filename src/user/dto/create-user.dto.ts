import { IsEmail, IsString, Length, Matches } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @Length(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:'Пароль должен содержать как минимум одну цифру, одну заглавную и одну строчную буквы.'
  })
  @IsString()
  password: string;

  @IsString()
  nickname: string;
}
