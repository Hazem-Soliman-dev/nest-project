import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Like } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const product = await this.productRepository.findOne({
      where: { id: createCartDto.productId },
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const user = await this.userRepository.findOne({
      where: { id: createCartDto.userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existingCart = await this.cartRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: product.id },
      },
    });

    if (existingCart) {
      existingCart.quantity += createCartDto.quantity;
      const updatedCart = await this.cartRepository.save(existingCart);
      return {
        message: 'Cart updated successfully',
        data: updatedCart,
        status: 200,
      };
    }

    const cart = this.cartRepository.create({
      product,
      user,
      quantity: createCartDto.quantity,
    });

    const savedCart = await this.cartRepository.save(cart);
    return {
      message: 'Cart created successfully',
      data: savedCart,
      status: 201,
    };
  }

  async findAll(search?: string, page?: number) {
    const carts = await this.cartRepository.find({
      ...(search
        ? { where: { product: { name: Like(`%${search}%`) } } }
        : {
            skip: page ? (page - 1) * 5 : undefined,
            take: page ? 5 : undefined,
          }),
      relations: ['product', 'user'],
    });

    if (!carts.length) {
      throw new BadRequestException('No carts found');
    }

    return {
      message: 'Carts fetched successfully',
      data: carts,
      status: 200,
    };
  }

  async findCart(id: string) {
    if (!id) {
      throw new BadRequestException('Cart ID is required');
    }
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    return {
      message: 'Cart fetched successfully',
      data: cart,
      status: 200,
    };
  }

  async updateCart(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findOne({
      where: { id },
    });
    if (!cart) {
      throw new BadRequestException('Cart not found');
    }
    const updatedCart = await this.cartRepository.update(id, updateCartDto);
    return {
      message: 'Cart updated successfully',
      data: updatedCart,
      status: 200,
    };
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Cart ID is required');
    }
    const deletedCart = await this.cartRepository.delete(id);
    if (!deletedCart) {
      throw new BadRequestException('Failed to delete cart');
    }
    return {
      message: 'Cart deleted successfully',
      status: 200,
    };
  }
}
