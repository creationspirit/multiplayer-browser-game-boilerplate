import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserItems } from './UserItems';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 200 })
  description!: string;

  @Column({ length: 200 })
  imageUrl!: string;

  @Column()
  price!: number;

  @OneToMany(() => UserItems, userItems => userItems.item)
  users!: UserItems[];
}
