import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Request } from "express"
import { Roles } from "@/decorators/roles.decorator"
import { PermissionDeniedError } from "@/shared/errors/guard"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler())

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest() as Request
    const user = request.session.user

    if (roles.some(role => user?.roles?.includes(role))) {
      return true
    }

    throw new PermissionDeniedError({ userId: user?.id, requiredRoles: roles })
  }
}
