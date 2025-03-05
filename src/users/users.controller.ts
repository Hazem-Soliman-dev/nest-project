import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { SignupUserDto } from './dto/signup-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from './services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * take {
   *   username: string,
   *   email: string,
   *   password: string,
   *   role: UserRole
   * }
   * if success return {
   *   message: 'User created successfully',
   *   data: {
   *     id: string,
   *     username: string,
   *     email: string
   *   }
   * }
   * if not return {
   *   message: 'User already exists',
   *   status: 400
   * }
   */
  @Post('signup')
  signUp(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUp(signupUserDto);
  }

  /**
   * take {
   *   email: string,
   *   password: string
   * }
   * if success return {
   *   message: 'Login successful',
   *   data: {
   *     id: string,
   *     username: string,
   *     email: string
   *   },
   *   access_token: string
   * }
   * if not return {
   *   message: 'Invalid credentials',
   *   status: 401
   * }
   */
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  /**
   * take {
   *   search?: string,
   *   page?: number,
   *   limit?: number
   * }
   * if success return {
   *   message: 'Users fetched successfully',
   *   data: User[],
   *   status: 200
   * }
   * if not return {
   *   message: 'No users found',
   *   status: 400
   * }
   */
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll(search, page, limit);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'User fetched successfully',
   *   data: User,
   *   status: 200
   * }
   * if not return {
   *   message: 'User not found',
   *   status: 400
   * }
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * take { id: string }
   * if success return {
   *   message: 'User deleted successfully',
   *   status: 200
   * }
   * if not return {
   *   message: 'User not found',
   *   status: 400
   * }
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
