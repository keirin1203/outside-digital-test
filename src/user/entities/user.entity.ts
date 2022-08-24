import { Tag } from "src/tag/entities/tag.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({unique: true})
  nickname: string;

  @ManyToMany(() => Tag, tag => tag.users)
  @JoinTable()
  tags: Tag[];
}