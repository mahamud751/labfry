import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
  MaxLength,
  ValidateBy,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

// Custom validator for password confirmation
export function IsPasswordMatch(
  property: string,
  validationOptions?: ValidationOptions
) {
  return ValidateBy(
    {
      name: "isPasswordMatch",
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    },
    validationOptions
  );
}

export class RegisterDto {
  @ApiProperty({
    example: "john.doe@labfry.com",
    description: "User email address",
  })
  @IsEmail({}, { message: "Invalid email address" })
  email: string;

  @ApiProperty({
    example: "SecurePass123!",
    description: "User password",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password: string;

  @ApiProperty({
    example: "SecurePass123!",
    description: "Confirm password - must match password",
  })
  @IsString()
  @MinLength(8, { message: "Confirm password must be at least 8 characters" })
  @IsPasswordMatch("password", { message: "Passwords do not match" })
  confirmPassword: string;

  @ApiProperty({ example: "John", description: "User first name" })
  @IsString()
  @MinLength(1, { message: "First name is required" })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      "First name can only contain letters, spaces, hyphens, and apostrophes",
  })
  firstName: string;

  @ApiProperty({ example: "Doe", description: "User last name" })
  @IsString()
  @MinLength(1, { message: "Last name is required" })
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      "Last name can only contain letters, spaces, hyphens, and apostrophes",
  })
  lastName: string;

  @ApiPropertyOptional({
    example: "USER",
    description: "User role",
    enum: ["ADMIN", "USER", "CUSTOMER"],
    default: "USER",
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  role?: string = "USER";
}

export class LoginDto {
  @ApiProperty({
    example: "john.doe@labfry.com",
    description: "User email address",
  })
  @IsEmail({}, { message: "Invalid email address" })
  email: string;

  @ApiProperty({ example: "SecurePass123!", description: "User password" })
  @IsString()
  @MinLength(1, { message: "Password is required" })
  password: string;

  @ApiPropertyOptional({ example: false, description: "Remember me option" })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean = false;
}

export class VerifyEmailDto {
  @ApiPropertyOptional({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Verification token",
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Verification token is required" })
  token?: string;

  @ApiPropertyOptional({
    example: "123456",
    description: "6-digit verification code",
  })
  @IsOptional()
  @IsString()
  @Length(6, 6, { message: "Verification code must be 6 digits" })
  @Matches(/^\d{6}$/, {
    message: "Verification code must contain only numbers",
  })
  code?: string;

  @ApiPropertyOptional({
    example: "john.doe@labfry.com",
    description: "Email address for code verification",
  })
  @IsOptional()
  @IsEmail({}, { message: "Valid email is required" })
  email?: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: "john.doe@labfry.com",
    description: "User email address",
  })
  @IsEmail({}, { message: "Invalid email address" })
  email: string;
}

export class ResetPasswordDto {
  @ApiPropertyOptional({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Password reset token",
  })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Reset token is required" })
  token?: string;

  @ApiPropertyOptional({ example: "654321", description: "6-digit reset code" })
  @IsOptional()
  @IsString()
  @Length(6, 6, { message: "Reset code must be 6 digits" })
  @Matches(/^\d{6}$/, { message: "Reset code must contain only numbers" })
  code?: string;

  @ApiPropertyOptional({
    example: "john.doe@labfry.com",
    description: "Email address for code reset",
  })
  @IsOptional()
  @IsEmail({}, { message: "Valid email is required" })
  email?: string;

  @ApiProperty({
    example: "NewSecurePass123!",
    description: "New password",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: "John", description: "User first name" })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "First name is required" })
  firstName?: string;

  @ApiPropertyOptional({ example: "Doe", description: "User last name" })
  @IsOptional()
  @IsString()
  @MinLength(1, { message: "Last name is required" })
  lastName?: string;

  @ApiPropertyOptional({
    example: "john.doe@labfry.com",
    description: "User email address",
  })
  @IsOptional()
  @IsEmail({}, { message: "Invalid email address" })
  email?: string;
}

export class ResendVerificationDto {
  @ApiProperty({
    example: "john.doe@labfry.com",
    description: "User email address",
  })
  @IsEmail({}, { message: "Valid email is required" })
  email: string;
}

export class OnlineStatusDto {
  @ApiProperty({ example: true, description: "Online status" })
  @IsBoolean()
  isOnline: boolean;
}

export class AdminResetPasswordDto {
  @ApiProperty({
    example: "user@labfry.com",
    description: "Target user email address",
  })
  @IsEmail({}, { message: "Please enter a valid email address" })
  targetEmail: string;

  @ApiProperty({
    example: "NewSecurePass123!",
    description: "New password for the user",
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  newPassword: string;
}
