import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Length, Matches } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id:string;
  @Column({ length: 20, unique: true })
  @Length(1, 20, { message: 'Username must be between 1 and 20 characters long' })
  @Matches(/^[a-z0-9_]+$/, {
    message: 'Username can only contain lowercase letters, numbers, and underscores',
  })
  username: string;
  @Column({nullable:false})
  firstName:string;
  @Column({nullable:false})
  lastName:string;
  @Column({unique:true,nullable:false})
  email:string;
  @Column({nullable:false})
  password:string;
  @Column({default:0})
  balance:number;
  @Column({ default: 'regular' })
  role: 'admin' | 'regular';
}