import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * take {
   *   name: string,
   *   description: string,
   *   price: number,
   *   category: { id: string },
   *   status: ProductStatus
   * }
   * if success return {
   *   message: 'Product created successfully',
   *   status: 201,
   *   success: true
   * }
   * if not return {
   *   message: 'Product not created',
   *   status: 400,
   *   success: false
   * }
   */
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  /**
   * take {
   *   search?: string,
   *   page?: number
   * }
   * if success return {
   *   message: 'Products retrieved successfully',
   *   data: Product[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No products found',
   *   status: 404,
   *   success: false
   * }
   */
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
  ) {
    return this.productsService.findAll(search, page);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Product fetched successfully',
   *   data: Product,
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Product not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  /**
   * take {
   *   id: string,
   *   updateProductDto: {
   *     name?: string,
   *     description?: string,
   *     price?: number,
   *     category?: { id: string },
   *     status?: ProductStatus
   *   }
   * }
   * if success return {
   *   message: 'Product updated successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Product not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Product status updated successfully to Active/Inactive',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Product not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch('/status/:id')
  changeStatus(@Param('id') id: string) {
    return this.productsService.changeStatus(id);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Product deleted successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Product not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
