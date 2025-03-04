import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  /**
   * 1-validate if user ID and product ID are valid UUIDs
   * 2-create new review with user ID, product ID, and rating
   * 3-save the review
   * 4-return success message or throw error if failed
   */
  async create(createReviewDto: CreateReviewDto) {
    if (!isUUID(createReviewDto.productId) || !isUUID(createReviewDto.userId)) {
      throw new BadRequestException('Invalid user ID or product ID');
    }

    const review = this.reviewRepository.create(createReviewDto);
    const savedReview = await this.reviewRepository.save(review);

    if (!savedReview) {
      throw new NotFoundException('Failed to create review');
    }

    return {
      message: 'Review created successfully',
      status: 201,
      success: true,
    };
  }

  /**
   * 1-fetch all reviews from database with related user and product data
   * 2-sort reviews by creation and update dates in descending order
   * 3-return reviews list or throw error if no reviews found
   */
  async findAll() {
    const reviews = await this.reviewRepository.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC', updatedAt: 'DESC' },
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found');
    }

    return {
      message: 'Reviews fetched successfully',
      data: reviews,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the review ID is a valid UUID
   * 2-fetch review by ID with related user and product data
   * 3-return review or throw error if not found
   */
  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid review ID');
    }

    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return {
      message: 'Review fetched successfully',
      data: review,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the review ID is a valid UUID
   * 2-check if the review exists
   * 3-update review fields if provided
   * 4-save the updated review
   * 5-return success message or throw error if update failed
   */
  async update(id: string, updateReviewDto: UpdateReviewDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid review ID');
    }

    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (updateReviewDto.rating) {
      review.rating = updateReviewDto.rating;
    }

    const updatedReview = await this.reviewRepository.save(review);
    if (!updatedReview) {
      throw new NotFoundException('Failed to update review');
    }

    return {
      message: 'Review updated successfully',
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the review ID is a valid UUID
   * 2-check if the review exists
   * 3-remove the review
   * 4-return success message or throw error if deletion failed
   */
  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid review ID');
    }

    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const deletedReview = await this.reviewRepository.remove(review);
    if (!deletedReview) {
      throw new NotFoundException('Failed to delete review');
    }

    return {
      message: 'Review deleted successfully',
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the product ID is a valid UUID
   * 2-fetch all reviews for the specified product
   * 3-return product reviews or throw error if no reviews found
   */
  async findByProduct(productId: string) {
    if (!isUUID(productId)) {
      throw new BadRequestException('Invalid product ID');
    }

    const reviews = await this.reviewRepository.find({
      where: {
        product: { id: productId },
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found for this product');
    }

    return {
      message: 'Product reviews fetched successfully',
      data: reviews,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the user ID is a valid UUID
   * 2-fetch all reviews by the specified user
   * 3-return user reviews or throw error if no reviews found
   */
  async findByUser(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const reviews = await this.reviewRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found for this user');
    }

    return {
      message: 'User reviews fetched successfully',
      data: reviews,
      status: 200,
      success: true,
    };
  }
}
