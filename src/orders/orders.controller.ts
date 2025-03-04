import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order/create-order.dto';
import { UpdateOrderDto } from './dto/order/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * take {
   *   userId: string,
   *   items: Array<{
   *     productId: string,
   *     quantity: number,
   *     price: number
   *   }>,
   *   totalAmount: number,
   *   status?: OrderStatus
   * }
   * if success return {
   *   message: 'Order created successfully',
   *   status: 201,
   *   success: true
   * }
   * if not return {
   *   message: 'Invalid...',
   *   status: 400,
   *   success: false
   * }
   */
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  /**
   * take {}
   * if success return {
   *   message: 'Orders fetched successfully',
   *   data: Order[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No orders found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'User orders fetched successfully',
   *   data: Order[],
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'No orders found for this user...',
   *   status: 404,
   *   success: false
   * }
   */
  @Get(':id')
  findUserOrders(@Param('id') id: string) {
    return this.ordersService.findUserOrders(id);
  }

  /**
   * take {
   *   id: string,
   *   updateOrderDto: {
   *     userId?: string,
   *     items?: Array<{
   *       productId?: string,
   *       quantity?: number,
   *       price?: number
   *     }>,
   *     totalAmount?: number,
   *     status?: OrderStatus
   *   }
   * }
   * if success return {
   *   message: 'Order updated successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Order not found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch(':id')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  /**
   * take {
   *   id: string,
   *   updateOrderDto: {
   *     status: OrderStatus
   *   }
   * }
   * if success return {
   *   message: 'Order status updated successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Order not found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Patch(':id/status')
  changeOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.changeOrderStatus(id, updateOrderDto);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'Order canceled successfully',
   *   status: 200,
   *   success: true
   * }
   * if not return {
   *   message: 'Order not found...',
   *   status: 404,
   *   success: false
   * }
   */
  @Delete(':id')
  cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(id);
  }
}
