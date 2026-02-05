import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/domain/value-objects";
import { PERMISSION_KEY } from "../decorators";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      PERMISSION_KEY,
      [
        context.getHandler(),
        context.getClass()
      ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return user.role == Role.root.value || requiredRoles.some(r => r.value == user.role);
  }
}
