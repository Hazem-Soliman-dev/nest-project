import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order/create-order.dto';
import { UpdateOrderDto } from './dto/order/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  /**
   * 1-check if the user ID is valid UUID
   * 2-create new order with user ID and total amount
   * 3-save the order first
   * 4-create order items for each product
   * 5-save all order items
   * 6-return success message with order data or throw error if failed
   */
  async createOrder(createOrderDto: CreateOrderDto) {
    if (!isUUID(createOrderDto.userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const order = this.orderRepository.create({
      user: { id: createOrderDto.userId },
      totalAmount: createOrderDto.totalAmount,
      status: createOrderDto.status || OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);
    if (!savedOrder) {
      throw new NotFoundException('Failed to create order');
    }

    const orderItems = createOrderDto.items.map((item) => {
      if (!isUUID(item.productId)) {
        throw new BadRequestException(`Invalid product ID: ${item.productId}`);
      }
      return this.orderItemRepository.create({
        orders: savedOrder,
        product: { id: item.productId },
        quantity: item.quantity,
        price: item.price,
      });
    });

    const savedItems = await this.orderItemRepository.save(orderItems);
    if (!savedItems) {
      throw new NotFoundException('Failed to create order items');
    }

    return {
      message: 'Order created successfully',
      status: 201,
      success: true,
    };
  }

  /**
   * 1-fetch all orders from database with related order items and user data
   * 2-sort orders by creation and update dates in descending order
   * 3-return orders list with items or throw error if no orders found
   */
  async findAllOrders() {
    const orders = await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product', 'user'],
      order: { createdAt: 'DESC', updatedAt: 'DESC' },
    });

    if (orders.length === 0) {
      throw new NotFoundException('No orders found');
    }

    return {
      message: 'Orders fetched successfully',
      data: orders,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the user ID is a valid UUID
   * 2-fetch all orders for the specified user with related order items and user data
   * 3-sort orders by creation and update dates in descending order
   * 4-return user's orders list with items or throw error if no orders found
   */
  async findUserOrders(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const orders = await this.orderRepository.find({
      where: { user: { id } },
      relations: ['orderItems', 'orderItems.product', 'user'],
      order: { createdAt: 'DESC', updatedAt: 'DESC' },
    });

    if (orders.length === 0) {
      throw new NotFoundException('No orders found for this user');
    }

    return {
      message: 'User orders fetched successfully',
      data: orders,
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the order ID is a valid UUID
   * 2-check if the order exists in database with its items
   * 3-update order fields if provided (total amount, status)
   * 4-if items are provided, delete existing items and create new ones
   * 5-save the updated order
   * 6-return success message with updated order or throw error if update failed
   */
  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (updateOrderDto.totalAmount !== undefined) {
      order.totalAmount = updateOrderDto.totalAmount;
    }
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.items) {
      await this.orderItemRepository.delete({ orders: { id } });

      const orderItems = updateOrderDto.items.map((item) => {
        if (!isUUID(item.productId)) {
          throw new BadRequestException(
            `Invalid product ID: ${item.productId}`,
          );
        }
        return this.orderItemRepository.create({
          orders: order,
          product: { id: item.productId },
          quantity: item.quantity,
          price: item.price,
        });
      });

      await this.orderItemRepository.save(orderItems);
    }

    const updatedOrder = await this.orderRepository.save(order);
    return {
      message: 'Order updated successfully',
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the order ID is a valid UUID
   * 2-check if the order exists in database
   * 3-validate if status is provided in update DTO
   * 4-update the order status
   * 5-save the updated order
   * 6-return success message with updated order or throw error if update failed
   */
  async changeOrderStatus(id: string, updateOrderDto: UpdateOrderDto) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!updateOrderDto.status) {
      throw new BadRequestException('Status is required');
    }

    order.status = updateOrderDto.status;
    const updatedOrder = await this.orderRepository.save(order);

    return {
      message: 'Order status updated successfully',
      status: 200,
      success: true,
    };
  }

  /**
   * 1-validate if the order ID is a valid UUID
   * 2-check if the order exists in database
   * 3-update the order status to CANCELLED
   * 4-save the cancelled order
   * 5-return success message with cancelled order or throw error if cancellation failed
   */
  async cancelOrder(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = OrderStatus.CANCELLED;
    const cancelledOrder = await this.orderRepository.save(order);

    return {
      message: 'Order canceled successfully',
      status: 200,
      success: true,
    };
  }
}
