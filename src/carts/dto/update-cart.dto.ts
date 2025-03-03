import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCartDto {
  @IsNumber()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  productId: string;

  @IsString()
  @IsOptional()
  userId: string;
}

