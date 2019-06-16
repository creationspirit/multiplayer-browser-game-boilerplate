import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserStats {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  experience!: number;

  @Column('smallint')
  level!: number;

  @Column('smallint')
  loc!: number;

  @OneToOne(type => User, 'stats')
  @JoinColumn()
  user!: User;
}
