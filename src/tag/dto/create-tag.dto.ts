import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  sortOrder: number;
}
