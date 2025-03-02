import { Product } from '../../products/entities/product.entity';

export class CreateCategoryDto {
	name: string;
	description: string;
	products: Product[];
}
