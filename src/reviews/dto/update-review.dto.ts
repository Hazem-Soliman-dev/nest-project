import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ProductRating } from '../entities/review.entity';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
	@IsEnum(ProductRating)
	@IsOptional()
	rating: ProductRating;
}
