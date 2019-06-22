import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Stage } from './Stage';

@Entity()
export class UserStageStats {
  @ManyToOne(() => User, user => user.stageStats, { primary: true })
  user!: User;

  @ManyToOne(() => Stage, stage => stage.userStats, { primary: true, eager: true })
  stage!: Stage;

  @Column()
  level!: number;

  @Column()
  loc!: number;
}
