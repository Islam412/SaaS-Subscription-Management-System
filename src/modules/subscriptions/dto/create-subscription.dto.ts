import { IsString, IsNotEmpty, IsDateString, IsOptional, IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Customer ID (UUID)',
  })
  @IsUUID(4, { message: 'Invalid customer ID format' })
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Plan ID (UUID)',
  })
  @IsUUID(4, { message: 'Invalid plan ID format' })
  @IsNotEmpty({ message: 'Plan ID is required' })
  planId: string;

  @ApiProperty({
    example: '2026-06-27T00:00:00Z',
    description: 'Subscription start date (ISO format)',
    required: false,
  })
  @IsDateString({}, { message: 'Start date must be a valid ISO date string' })
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: '2026-07-27T00:00:00Z',
    description: 'Subscription end date (ISO format, optional)',
    required: false,
  })
  @IsDateString({}, { message: 'End date must be a valid ISO date string' })
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    enum: SubscriptionStatus,
    example: 'ACTIVE',
    description: 'Subscription status (ACTIVE, CANCELLED, EXPIRED, PAUSED)',
    required: false,
  })
  @IsEnum(SubscriptionStatus, { message: 'Status must be one of: ACTIVE, CANCELLED, EXPIRED, PAUSED' })
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiProperty({
    example: true,
    description: 'Auto renew subscription',
    required: false,
  })
  @IsBoolean({ message: 'Auto renew must be a boolean' })
  @IsOptional()
  autoRenew?: boolean;
}