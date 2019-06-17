import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Stage } from './Stage';

@Entity()
export class UserStageStats {
  @PrimaryColumn()
  userId!: number;

  @ManyToOne(() => User, 'stageStats')
  @JoinColumn({ name: 'userId' })
  user!: User;

  @PrimaryColumn()
  stageId!: number;

  @ManyToOne(() => Stage, 'userStats')
  @JoinColumn({ name: 'stageId' })
  stage!: Stage;

  @Column()
  level!: number;

  @Column()
  loc!: number;
}
