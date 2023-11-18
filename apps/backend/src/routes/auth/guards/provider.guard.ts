import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { ProvidersService } from '@/routes/auth/providers/providers.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
  constructor(private readonly providersService: ProvidersService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const provider = request.params.provider;

    const providerInstance = this.providersService.findService(provider);

    if (!providerInstance) {
      throw new HttpException('Unknown provider', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
