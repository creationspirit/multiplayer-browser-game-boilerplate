import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserStats {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int', { default: 0 })
  experience!: number;

  @Column('smallint', { default: 1 })
  level!: number;

  @Column('smallint', { default: 0 })
  loc!: number;

  @Column('smallint', { default: 0 })
  coopMatches!: number;

  @Column('smallint', { default: 0 })
  battleMatches!: number;

  @OneToOne(type => User, 'stats')
  @JoinColumn()
  user!: User;
}
