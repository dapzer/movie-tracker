import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Request } from "express"
import { ProvidersService } from "@/services/auth/providers/providers.service"
import { UnknownProviderError } from "@/shared/errors/auth"

@Injectable()
export class AuthProviderGuard implements CanActivate {
  constructor(private readonly providersService: ProvidersService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request

    const provider = request.params.provider

    const providerInstance = this.providersService.findService(provider)

    if (!providerInstance) {
      throw new UnknownProviderError({ provider })
    }

    return true
  }
}
