import { Type } from 'class-transformer';
import { Product } from '../../products/entities/product.entity';
import { IsNotEmpty, IsOptional, IsString, Length, ValidateNested, IsArray } from 'class-validator';

export class CreateCategoryDto {
	@IsNotEmpty()
	@IsString()
	@Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
	name: string;

	@IsOptional()
	@IsString()
	@Length(3, 20, { message: 'Description must be between 3 and 20 characters' })
	description: string;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Product)	
	products: Product[];
}
