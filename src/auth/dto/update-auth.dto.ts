import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';
export class UpdateAuthDto extends PartialType(CreateAuthDto) {
	@IsOptional()
	@IsString()
	username: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	password: string;
}
