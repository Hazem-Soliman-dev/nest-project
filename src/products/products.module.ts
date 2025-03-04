import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Cart, OrderItem, Review])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
