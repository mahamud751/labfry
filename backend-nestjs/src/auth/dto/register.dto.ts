import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsString, 
  MinLength, 
  MaxLength, 
  Matches, 
  IsEnum, 
  IsOptional 
} from 'class-validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER', 
  CUSTOMER = 'CUSTOMER',
}

export class RegisterDto {
  @ApiProperty({
    description: 'User email address - must be valid and unique',
    example: 'john.doe@labfry.com',
    format: 'email',
    maxLength: 255,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  email: string;

  @ApiProperty({
    description: 'User password - must contain uppercase, lowercase, number, and special character',
    example: 'SecurePass123!',
    minLength: 8,
    maxLength: 128,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must be less than 128 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    { 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
    }
  )
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(1, { message: 'First name is required' })
  @MaxLength(50, { message: 'First name must be less than 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, { 
    message: 'First name can only contain letters, spaces, hyphens, and apostrophes' 
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(1, { message: 'Last name is required' })
  @MaxLength(50, { message: 'Last name must be less than 50 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, { 
    message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' 
  })
  lastName: string;

  @ApiProperty({
    description: 'User role in the system',
    example: UserRole.USER,
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be one of: ADMIN, USER, CUSTOMER' })
  role?: UserRole = UserRole.USER;
}