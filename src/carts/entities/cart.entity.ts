import { User } from "src/users/entities/user.entity";
import { Product } from "src/products/entities/product.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Cart {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User, (user) => user.cart)
	user: User;

	@ManyToOne(() => Product, (product) => product.cart)
	product: Product;

	@Column()
	quantity: number;
}
