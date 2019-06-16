import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import jwt from 'jsonwebtoken';

import { UserStats } from './UserStats';

type edgarResponse = {
  id: number;
  alt_id2: string;
  first_name: string;
  last_name: string;
  email: string;
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  edgarId!: number;

  @Column({ length: 50 })
  firstName!: string;

  @Column({ length: 50 })
  lastName!: string;

  @Column({ length: 50 })
  email!: string;

  @OneToOne(type => UserStats, 'user', { cascade: true, eager: true })
  stats!: UserStats;

  loadFromEdgarResponse(user: edgarResponse) {
    this.edgarId = user.id;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.email = user.email;
  }

  async generateAuthToken() {
    const token = await jwt.sign({ _id: this.edgarId }, process.env.JWT_SECRET as string);
    return token;
  }
}
