import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Subscription ID (UUID)',
  })
  @IsUUID(4, { message: 'Invalid subscription ID format' })
  @IsNotEmpty({ message: 'Subscription ID is required' })
  subscriptionId: string;

  @ApiProperty({
    example: 100,
    description: 'Invoice amount',
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Max(999999.99, { message: 'Amount must not exceed 999999.99' })
  amount: number;

  @ApiProperty({
    example: 0,
    description: 'Tax amount (optional)',
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @Min(0, { message: 'Tax must be greater than or equal to 0' })
  @Max(100, { message: 'Tax must not exceed 100%' })
  @IsOptional()
  tax?: number;

  @ApiProperty({
    example: '2026-07-27T00:00:00Z',
    description: 'Due date (ISO format, optional)',
    required: false,
  })
  @IsDateString({}, { message: 'Due date must be a valid ISO date string' })
  @IsOptional()
  dueDate?: string;
}