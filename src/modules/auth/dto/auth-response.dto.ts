import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'My Company',
    description: 'User name',
  })
  name: string;

  @ApiProperty({
    example: 'admin@company.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'User role (ADMIN or STAFF)',
  })
  role: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Tenant ID (company)',
  })
  tenantId: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'User information',
  })
  user: UserResponseDto;
}