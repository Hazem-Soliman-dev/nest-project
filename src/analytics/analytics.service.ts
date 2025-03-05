import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { OrderStatus } from 'src/orders/entities/order.entity';
import { ProductStatus } from 'src/products/entities/product.entity';
import { role } from 'src/users/entities/user.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private analyticsRepository: Repository<Analytics>,
  ) {}

  async getSales() {
    const sales = await this.analyticsRepository.find({
      where: { orders: { status: OrderStatus.SHIPPED } },
      relations: ['orders', 'products', 'users'],
    });
    const totalSales = sales.length;
    if (totalSales === 0) {
      throw new NotFoundException('No sales found');
    }
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.orders.reduce((acc, order) => acc + order.totalAmount, 0), 0);
    const ordersByDate = sales.reduce((acc, sale) => {
      const date = sale.orders[0].createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += sale.orders.length;
      return acc;
    }, {});
    return { 
      message: 'Sales fetched successfully',
      totalSales,
      totalRevenue,
      ordersByDate,
    };
  }

  async getProduct() {
    const products = await this.analyticsRepository.find({
      where: { products: { status: ProductStatus.ACTIVE } },
      relations: ['orders', 'products', 'users'],
    });
    const totalProducts = products.length;
    if (totalProducts === 0) {
      throw new NotFoundException('No products found');
    }
    const totalProductsSold = products.reduce((acc, product) => acc + product.orders.reduce((acc, order) => acc + order.orderItems.length, 0), 0);
    const topSellingProducts = products.sort((a, b) => b.orders.reduce((acc, order) => acc + order.orderItems.length, 0) - a.orders.reduce((acc, order) => acc + order.orderItems.length, 0)).slice(0, 5);
    return { 
      message: 'Products fetched successfully',
      totalProducts,
      totalProductsSold,
      topSellingProducts,
    };
  }

  async getUser() {
    const users = await this.analyticsRepository.find({
      where: { users: { role: role.CUSTOMER } },
      relations: ['orders', 'products', 'users'],
    });
    const totalUsers = users.length;
    if (totalUsers === 0) {
      throw new NotFoundException('No users found');
    }
    const activeUsers = users.filter((user) => user.orders.length > 0);
    const inactiveUsers = users.filter((user) => user.orders.length === 0);
    const newUsers = users.filter((user) => user.orders.length === 0);
    return { 
      message: 'Users fetched successfully',
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsers,
    };
  }
}
