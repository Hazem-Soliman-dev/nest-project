import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductStatus } from './entities/product.entity';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * 1-check if the data valid by dto/create-product.dto.ts validation file
   * 2-create new product instance
   * 3-save the product to database
   * 4-return success message or throw error if creation failed
   */
  async create(createProductDto: CreateProductDto) {
    const product = await this.productRepository.create(createProductDto);
    if (!product) {
      throw new BadRequestException('Product not created');
    }
    await this.productRepository.save(product);
    return {
      message: 'Product created successfully',
      status: 201,
      success: true,
    };
  }

  /**
   * 1-check if search parameter exists for filtering
   * 2-apply pagination if page parameter exists
   * 3-fetch products with related category data
   * 4-return products list or throw error if no products found
   */
  async findAll(search?: string, page?: number) {
    const products = await this.productRepository.find({
      where: search ? { name: Like(`%${search}%`) } : {},
      relations: ['category'],
      skip: page ? (page - 1) * 5 : 0,
      take: 5,
    });

    if (products.length === 0) {
      throw new NotFoundException('No products found');
    }

    return {
      message: 'Products retrieved successfully',
      data: products,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the product ID is a valid UUID
   * 2-fetch product by ID from database
   * 3-return product data or throw error if not found
   */
  async findOne(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'Product fetched successfully',
      data: product,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the product ID is a valid UUID
   * 2-check if the product exists in database
   * 3-update the product with new data
   * 4-return success message or throw error if update failed
   */
  async update(id: string, updateProductDto: UpdateProductDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.productRepository.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return {
      message: 'Product updated successfully',
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the product ID is a valid UUID
   * 2-check if the product exists in database
   * 3-toggle product status between ACTIVE and INACTIVE
   * 4-return success message with new status or throw error if update failed
   */
  async changeStatus(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.update(id, {
      status:
        product.status === ProductStatus.ACTIVE
          ? ProductStatus.INACTIVE
          : ProductStatus.ACTIVE,
    });
    return {
      message:
        'Product status updated successfully to ' +
        (product.status === ProductStatus.ACTIVE ? 'Inactive' : 'Active'),
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the product ID is a valid UUID
   * 2-check if the product exists in database
   * 3-update product status to DELETED
   * 4-return success message or throw error if deletion failed
   */
  async remove(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid product ID');
    }
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.productRepository.update(id, {
      status: ProductStatus.DELETED,
    });
    return {
      message: 'Product deleted successfully',
      status: 200,
      success: true,
    };
  }
}
