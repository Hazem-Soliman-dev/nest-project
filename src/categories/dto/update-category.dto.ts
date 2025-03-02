import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Product } from '../../products/entities/product.entity';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
	name: string;
	description: string;
	products: Product[];
}
