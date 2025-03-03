import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  findCart(@Param('id') id: string) {
    return this.cartsService.findCart(id);
  }

  @Patch(':id')
  updateCart(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.updateCart(id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }
}
