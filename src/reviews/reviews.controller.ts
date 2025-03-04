import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

   /**
   * take {
   *   userId: string,
   *   productId: string,
   *   rating: ONE || TWO || THERE || FOUR || FIVE
   * }
   * if success return {
   *   message: 'Review created successfully',
   *   status: 201,
   *   success: true
   * }
   * if not return {
   *   message: 'Invalid ...',
   *   status: 400,
   *   success: false
   * }
   */
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

   /**
   * take {}
   * if success return {
   *   message: 'Reviews fetched successfully',
   *   data: Review[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No Reviews found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Review fetched successfully',
   *   data: Review{},
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No reviews found for this user...',
   *   status: 404,
   *   success: false
   * }
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  /**
   * take {
   *   id: string (param)
   *   rating: ONE || TWO || THERE || FOUR || FIVE
   * }
   * if success return {
   *   message: 'Review updated successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Review not found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Review canceled successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Review not found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

   /**
   * take { productId: string }
   * if success return {
   *   message: 'Product reviews fetched successfully',
   *   data: ProductReviews[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No reviews found for this product...',
   *   status: 404,
   *   success: false
   * }
   */
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

   /**
   * take { userId: string }
   * if success return {
   *   message: 'Users reviews fetched successfully',
   *   data: UsersReviews[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No reviews found for this user...',
   *   status: 404,
   *   success: false
   * }
   */
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }
}
