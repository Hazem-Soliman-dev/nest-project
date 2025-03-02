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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

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

  async findOne(id: string) {
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
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

  async changeStatus(id: string) {
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

  async remove(id: string) {
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
