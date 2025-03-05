import { Module } from '@nestjs/common';
import { UsersService } from './services/users/users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Order } from 'src/orders/entities/order.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Analytics } from 'src/analytics/entities/analytics.entity';
import { AuthService } from './services/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Order, Cart, Review, Analytics]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}
