import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async signUp(createAuthDto: CreateAuthDto) {
    const existingUser = await this.authRepository.findOne({ where: { email: createAuthDto.email } });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    createAuthDto.password = hashedPassword;

    const savedUser = await this.authRepository.save(createAuthDto);
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

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.authRepository.findOne({ where: { email: loginAuthDto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginAuthDto.password, user.password);
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
}
