import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 1-check if search parameter exists for filtering
   * 2-apply pagination if page parameter exists
   * 3-fetch users with related cart data
   * 4-return users list or throw error if no users found
   */
  async findAll(search?: string, page?: number, limit: number = 5) {
    const users = await this.userRepository.find({
      ...(search
        ? { where: { username: Like(`%${search}%`) } }
        : {
            skip: page ? (page - 1) * limit : undefined,
            take: page ? limit : undefined,
          }),
      relations: ['cart'],
    });

    if (!users.length) {
      throw new BadRequestException('No users found');
    }

    return {
      message: 'Users fetched successfully',
      data: users,
      status: 200,
    };
  }

  /**
   * 1-fetch user by ID with related cart data
   * 2-return user data or throw error if not found
   */
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['cart'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'User fetched successfully',
      data: user,
      status: 200,
    };
  }

  /**
   * 1-check if user exists in database
   * 2-delete the user
   * 3-return success message or throw error if deletion failed
   */
  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (!result.affected) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'User deleted successfully',
      status: 200,
    };
  }
}
