import { CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { SignUpMethodEnum, UserType } from '@movie-tracker/types';

export class EmailConfirmedGuard implements CanActivate {
  canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const user = request.session.user as Omit<UserType, "password">;

    if (user && user?.isEmailVerified || user.signUpMethod !== SignUpMethodEnum.EMAIL) {
      return true;
    }

    throw new HttpException('Email not confirmed', HttpStatus.FORBIDDEN);
  }
}
