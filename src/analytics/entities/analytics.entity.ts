import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('analytics')
export class Analytics {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'date', default: () => 'CURRENT_DATE'})
	date: Date;

	@OneToMany(() => Order, (order) => order.id)
	orders: Order[];

	@OneToMany(() => Product, (product) => product.id)
	products: Product[];

	@OneToMany(() => User, (user) => user.id)
	users: User[];
}
