import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common"
import { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request

    if (typeof request.session.user !== "undefined") {
      return true
    }

    throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
  }
}
