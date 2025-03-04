import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ProductRating } from '../entities/review.entity';

export class CreateReviewDto {
  @IsEnum(ProductRating)
  @IsNotEmpty()
  rating: ProductRating;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @IsString()
  productId: string;
}
