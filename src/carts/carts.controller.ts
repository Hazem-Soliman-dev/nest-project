import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  /**
   * take {
   *   userId: string,
   *   productId: string,
   *   quantity: number
   * }
   * if success return {
   *   message: 'Cart created/updated successfully',
   *   data: Cart,
   *   status: 201/200
   * }
   * if not return {
   *   message: 'Product/User not found',
   *   status: 400
   * }
   */
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  /**
   * take {
   *   search?: string,
   *   page?: number
   * }
   * if success return {
   *   message: 'Carts fetched successfully',
   *   data: Cart[],
   *   status: 200
   * }
   * if not return {
   *   message: 'No carts found',
   *   status: 400
   * }
   */
  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Cart fetched successfully',
   *   data: Cart,
   *   status: 200
   * }
   * if not return {
   *   message: 'Cart not found',
   *   status: 400
   * }
   */
  @Get(':id')
  findCart(@Param('id') id: string) {
    return this.cartsService.findCart(id);
  }

  /**
   * take {
   *   id: string,
   *   updateCartDto: {
   *     quantity: number
   *   }
   * }
   * if success return {
   *   message: 'Cart updated successfully',
   *   data: Cart,
   *   status: 200
   * }
   * if not return {
   *   message: 'Cart not found',
   *   status: 400
   * }
   */
  @Patch(':id')
  updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.updateCart(id, updateCartDto);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Cart deleted successfully',
   *   status: 200
   * }
   * if not return {
   *   message: 'Failed to delete cart',
   *   status: 400
   * }
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }
}
