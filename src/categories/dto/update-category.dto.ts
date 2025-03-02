import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Product } from '../../products/entities/product.entity';
import { IsOptional, IsString, Length, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
	@IsOptional()
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
