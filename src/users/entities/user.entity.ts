import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cart } from 'src/carts/entities/cart.entity';

export enum role {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
  SUPER_ADMIN = 'Super Admin',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: role, default: role.CUSTOMER })
  role: role;

  @OneToMany(() => Cart, (cart) => cart.user)
  cart: Cart[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
