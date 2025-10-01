import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "./register.dto";

export class UserResponseDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011", description: "User ID" })
  id: string;

  @ApiProperty({
    example: "john.doe@labfry.com",
    description: "User email address",
  })
  email: string;

  @ApiProperty({ example: "John", description: "User first name" })
  firstName: string;

  @ApiProperty({ example: "Doe", description: "User last name" })
  lastName: string;

  @ApiProperty({
    example: "USER",
    description: "User role",
    enum: ["ADMIN", "USER", "CUSTOMER"],
  })
  role: string;

  @ApiProperty({
    example: "ACTIVE",
    description: "User status",
    enum: ["PENDING_VERIFICATION", "ACTIVE", "SUSPENDED", "DELETED"],
  })
  status: string;

  @ApiProperty({ example: true, description: "Email verification status" })
  emailVerified: boolean;

  @ApiProperty({ example: true, description: "Online status" })
  isOnline: boolean;

  @ApiPropertyOptional({
    example: "2024-01-15T10:30:00.000Z",
    description: "Last seen timestamp",
  })
  lastSeen?: Date;

  @ApiProperty({
    example: "2024-01-01T00:00:00.000Z",
    description: "Account creation timestamp",
  })
  createdAt: Date;

  @ApiProperty({
    example: "2024-01-15T10:30:00.000Z",
    description: "Last update timestamp",
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ example: true, description: "Success status" })
  success: boolean;

  @ApiProperty({ example: "Login successful", description: "Response message" })
  message: string;

  @ApiPropertyOptional({
    type: UserResponseDto,
    description: "User information",
  })
  user?: UserResponseDto;

  @ApiPropertyOptional({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT access token",
  })
  token?: string;

  @ApiPropertyOptional({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT refresh token",
  })
  refreshToken?: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false, description: "Success status" })
  success: boolean;

  @ApiProperty({
    example: "Invalid email or password",
    description: "Error message",
  })
  message: string;

  @ApiProperty({ example: 400, description: "HTTP status code" })
  statusCode: number;

  @ApiPropertyOptional({
    example: ["Email must be a valid email address"],
    description: "Validation errors",
  })
  errors?: string[];
}

export class RateLimitResponseDto {
  @ApiProperty({ example: false, description: "Success status" })
  success: boolean;

  @ApiProperty({
    example: "Too many requests. Please try again in 1 minute.",
    description: "Rate limit message",
  })
  message: string;

  @ApiProperty({ example: 60, description: "Retry after seconds" })
  retryAfter: number;

  @ApiProperty({ example: 60000, description: "Retry after milliseconds" })
  retryAfterMs: number;

  @ApiProperty({
    example: "2024-01-15T10:30:00.000Z",
    description: "Timestamp of rate limit",
  })
  timestamp: string;
}
