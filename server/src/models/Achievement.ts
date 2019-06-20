import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from './User';
import { AchievementRule } from './AchievementRule';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 200 })
  description!: string;

  @Column()
  reward!: number;

  @OneToMany(type => AchievementRule, rule => rule.achievement)
  rules!: AchievementRule[];

  @ManyToMany(type => User, user => user.achievements)
  users!: User[];
}
