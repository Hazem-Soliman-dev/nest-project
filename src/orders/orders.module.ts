import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [Order, OrderItem, User, Product],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
