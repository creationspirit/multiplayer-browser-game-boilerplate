import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class UserItems {
  @ManyToOne(() => User, user => user.items, { primary: true })
  user!: User;

  @ManyToOne(() => Item, item => item.users, { primary: true, eager: true })
  item!: Item;

  @Column()
  amount!: number;
}
