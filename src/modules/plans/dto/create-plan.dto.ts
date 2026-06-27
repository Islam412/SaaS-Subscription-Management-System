import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle } from '@prisma/client';

export class CreatePlanDto {
  @ApiProperty({
    example: 'Bronze Plan',
    description: 'Plan name',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Plan name is required' })
  @MinLength(2, { message: 'Plan name must be at least 2 characters' })
  @MaxLength(100, { message: 'Plan name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    example: 'Basic plan for small businesses',
    description: 'Plan description (optional)',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    example: 100,
    description: 'Plan price',
    minimum: 0,
    maximum: 999999.99,
  })
  @IsNumber()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999.99, { message: 'Price must not exceed 999999.99' })
  price: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency (optional)',
    required: false,
    maxLength: 10,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10, { message: 'Currency must not exceed 10 characters' })
  currency?: string;

  @ApiProperty({
    enum: BillingCycle,
    example: 'MONTHLY',
    description: 'Billing cycle (MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL)',
    required: false,
  })
  @IsEnum(BillingCycle, { message: 'Billing cycle must be one of: MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL' })
  @IsOptional()
  billingCycle?: BillingCycle;
}