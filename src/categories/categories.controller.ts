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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * take {
   *   name: string,
   *   description: string,
   *   status: CategoryStatus
   * }
   * if success return {
   *   message: 'Category created successfully',
   *   status: 201,
   *   success: true
   * }
   * if not return {
   *   message: 'Category not created',
   *   status: 400,
   *   success: false
   * }
   */
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * take { search?: string }
   * if success return {
   *   message: 'Categories fetched successfully',
   *   data: Category[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No categories found',
   *   status: 404,
   *   success: false
   * }
   */
  @Get()
  findAll(@Query('search') search?: string) {
    return this.categoriesService.findAll(search);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Category fetched successfully',
   *   data: Category,
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Category not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * take {
   *   id: string,
   *   updateCategoryDto: {
   *     name?: string,
   *     description?: string,
   *     status?: CategoryStatus
   *   }
   * }
   * if success return {
   *   message: 'Category updated successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Category not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Category status updated successfully to Active/Inactive',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Category not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch('/status/:id')
  changeStatus(@Param('id') id: string) {
    return this.categoriesService.changeStatus(id);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Category deleted successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Category not found',
   *   status: 404,
   *   success: false
   * }
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
