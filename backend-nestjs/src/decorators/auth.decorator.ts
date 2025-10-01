import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);

export const RequireEmailVerification = () =>
  SetMetadata("emailVerification", true);
