import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	@Length(3, 20, { message: 'Name must be between 3 and 20 characters' })
	name: string;

	@IsNotEmpty()
	@IsNumber()
	price: number;

	@IsOptional()
	@IsString()
	@Length(3, 20, { message: 'Description must be between 3 and 20 characters' })
	description: string;

	@IsOptional()
	@IsString()
	image: string;

	@IsOptional()
	@IsNumber()
	stockQuantity: number;

	@IsNotEmpty()
	@IsString()
	@IsUUID(undefined, { message: 'Category ID must be a valid id' })
	categoryId: string;
}
