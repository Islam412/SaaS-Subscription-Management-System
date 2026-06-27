import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, IsEnum, IsDateString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Invoice ID (UUID)',
  })
  @IsUUID(4, { message: 'Invalid invoice ID format' })
  @IsNotEmpty({ message: 'Invoice ID is required' })
  invoiceId: string;

  @ApiProperty({
    example: 100,
    description: 'Payment amount',
    minimum: 0.01,
    maximum: 999999.99,
  })
  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @Max(999999.99, { message: 'Amount must not exceed 999999.99' })
  amount: number;

  @ApiProperty({
    enum: PaymentMethod,
    example: 'CASH',
    description: 'Payment method (CASH, BANK_TRANSFER, CREDIT_CARD, PAYPAL, OTHER)',
    required: false,
  })
  @IsEnum(PaymentMethod, { message: 'Method must be one of: CASH, BANK_TRANSFER, CREDIT_CARD, PAYPAL, OTHER' })
  @IsOptional()
  method?: PaymentMethod;

  @ApiProperty({
    example: 'PAY-001',
    description: 'Payment reference (optional)',
    required: false,
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Reference must not exceed 100 characters' })
  reference?: string;

  @ApiProperty({
    example: '2026-06-27T00:00:00Z',
    description: 'Payment date (ISO format, optional)',
    required: false,
  })
  @IsDateString({}, { message: 'Payment date must be a valid ISO date string' })
  @IsOptional()
  paymentDate?: string;
}