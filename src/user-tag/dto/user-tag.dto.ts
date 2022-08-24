import { IsArray, IsNotEmpty } from "class-validator";
import { Tag } from "src/tag/entities/tag.entity";

export class UserTagDto {
  @IsNotEmpty()
  @IsArray()
  tags: number[]
}