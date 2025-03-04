import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository, Like } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 1-check if user with email already exists
   * 2-hash the password using bcrypt
   * 3-save the new user to database
   * 4-return user data or throw error if creation failed
   */
  async signUp(signupUserDto: SignupUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: signupUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(signupUserDto.password, 10);
    signupUserDto.password = hashedPassword;

    const savedUser = await this.userRepository.save(signupUserDto);
    if (!savedUser) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      message: 'User created successfully',
      data: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
      },
    };
  }

  /**
   * 1-check if user exists with provided email
   * 2-validate password using bcrypt compare
   * 3-generate JWT token with user data
   * 4-return user data with token or throw error if credentials invalid
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return {
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      access_token,
    };
  }

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
