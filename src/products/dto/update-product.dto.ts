import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Length } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
	@IsOptional()
	@IsString()
	@Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
	name: string;

	@IsOptional()
	@IsNumber()
	price: number;

	@IsOptional()
	@IsString()
	description: string;

	@IsOptional()
	@IsString()
	image: string;

	@IsOptional()
	@IsNumber()
	stockQuantity: number;

	@IsOptional()
	@IsString()
	@IsUUID(undefined, { message: 'Category ID must be a valid id' })
	categoryId: string;
}
