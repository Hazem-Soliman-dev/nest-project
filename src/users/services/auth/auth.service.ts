import {
	Injectable,
	UnauthorizedException,
	BadRequestException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { SignupUserDto } from '../../dto/signup-user.dto';
  import { LoginUserDto } from '../../dto/login-user.dto';
  import { Repository } from 'typeorm';
  import { User } from '../../entities/user.entity';
  import { InjectRepository } from '@nestjs/typeorm';
  @Injectable()
  export class AuthService {
	constructor(
	  private readonly jwtService: JwtService,
	  @InjectRepository(User)
	  private userRepository: Repository<User>,
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
	  const access_token = this.createToken(payload);

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
	 * 1-create a payload with user id and role
	 * 2-generate a JWT token with the payload
	 * 3-return the token
	 */
	async createToken(user: { id: string; role: string }) {
	  const payload = { id: user.id, role: user.role };
	  const access_token = this.jwtService.sign(payload, {
		secret: process.env.JWT_SECRET,
		expiresIn: process.env.JWT_EXPIRES_IN,
	  });

	  return access_token;
	}
  }
  
