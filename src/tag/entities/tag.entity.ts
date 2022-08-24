import { User } from "src/user/entities/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne} from "typeorm";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User;

  @Column()
  name: string;

  @Column({default: 0})
  sortOrder: number;

  @ManyToMany(() => User, user => user.tags)
  users: User[]
}