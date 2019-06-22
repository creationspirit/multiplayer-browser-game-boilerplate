import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Achievement } from './Achievement';

@Entity()
export class AchievementRule {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  condition!: string;

  @ManyToOne(type => Achievement, achievement => achievement.rules)
  achievement!: Achievement;
}
