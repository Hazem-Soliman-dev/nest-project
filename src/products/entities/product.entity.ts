import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Analytics } from 'src/analytics/entities/analytics.entity';

export enum ProductStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DELETED = 'Deleted',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @Column({ nullable: true, default: 1 })
  stockQuantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Cart, (cart) => cart.product)
  cart: Cart[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ManyToOne(() => Analytics, (analytics) => analytics.products)
  analytics: Analytics;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
