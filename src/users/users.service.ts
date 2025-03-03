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
