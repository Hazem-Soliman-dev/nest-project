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

  /**
   * 1-check if product exists in database
   * 2-check if user exists in database
   * 3-check if cart item already exists for user and product
   * 4-if exists: update quantity, if not: create new cart item
   * 5-return success message with cart data
   */
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

  /**
   * 1-check if search parameter exists for filtering by product name
   * 2-apply pagination if page parameter exists
   * 3-fetch carts with related product and user data
   * 4-return carts list or throw error if no carts found
   */
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

  /**
   * 1-validate if cart ID is provided
   * 2-fetch cart by ID with related product and user data
   * 3-return cart data or throw error if not found
   */
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

  /**
   * 1-check if cart exists in database
   * 2-update cart with new data
   * 3-return success message with updated cart data
   */
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

  /**
   * 1-validate if cart ID is provided
   * 2-delete cart from database
   * 3-return success message or throw error if deletion failed
   */
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
