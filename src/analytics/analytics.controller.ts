import { Controller, Get} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  getSales() {
    return this.analyticsService.getSales();
  }

  @Get('products')
  getProducte() {
    return this.analyticsService.getProduct();
  }

  @Get('users')
  getUser() {
    return this.analyticsService.getUser();
  }
}
