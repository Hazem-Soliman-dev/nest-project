import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryStatus } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * 1-check if the data valid by dto/create-category.dto.ts validation file
   * 2-create new category instance
   * 3-save the category to database
   * 4-return success message or throw error if creation failed
   */
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    if (!category) {
      throw new BadRequestException('Category not created');
    }
    await this.categoryRepository.save(category);
    return {
      message: 'Category created successfully',
      status: 201,
      success: true,
    };
  }

  /**
   * 1-check if search parameter exists for filtering
   * 2-fetch only active categories with related products
   * 3-return categories list or throw error if no categories found
   */
  async findAll(search?: string) {
    const categories = await this.categoryRepository.find({
      where: search
        ? { name: Like(`%${search}%`), status: CategoryStatus.ACTIVE }
        : { status: CategoryStatus.ACTIVE },
      relations: ['products'],
    });
    if (categories.length === 0) {
      throw new NotFoundException('No categories found');
    }
    return {
      message: 'Categories fetched successfully',
      data: categories,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the category ID is a valid UUID
   * 2-fetch category by ID from database
   * 3-return category data or throw error if not found
   */
  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      message: 'Category fetched successfully',
      data: category,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the category ID is a valid UUID
   * 2-check if the category exists in database
   * 3-update the category with new data
   * 4-return success message or throw error if update failed
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this.categoryRepository.update(
      id,
      updateCategoryDto,
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      message: 'Category updated successfully',
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the category ID is a valid UUID
   * 2-check if the category exists in database
   * 3-toggle category status between ACTIVE and INACTIVE
   * 4-return success message with new status or throw error if update failed
   */
  async changeStatus(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.update(id, {
      status:
        category.status === CategoryStatus.ACTIVE
          ? CategoryStatus.INACTIVE
          : CategoryStatus.ACTIVE,
    });
    return {
      message:
        'Category status updated successfully to ' +
        (category.status === CategoryStatus.ACTIVE ? 'Inactive' : 'Active'),
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the category ID is a valid UUID
   * 2-check if the category exists in database
   * 3-update category status to DELETED
   * 4-return success message or throw error if deletion failed
   */
  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    await this.categoryRepository.update(id, {
      status: CategoryStatus.DELETED,
    });
    return {
      message: 'Category deleted successfully',
      status: 200,
      success: true,
    };
  }
}
