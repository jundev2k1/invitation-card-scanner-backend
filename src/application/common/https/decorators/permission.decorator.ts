import { SetMetadata } from "@nestjs/common";
import { Role } from "src/domain/value-objects";

export const PERMISSION_KEY = 'permissions';
export const Permission = (...roles: Role[]) => SetMetadata(PERMISSION_KEY, roles);
