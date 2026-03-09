import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"
import { UnauthorizedError } from "@/shared/errors/core"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request

    if (typeof request.session.user !== "undefined") {
      return true
    }

    throw new UnauthorizedError()
  }
}
