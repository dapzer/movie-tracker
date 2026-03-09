import { SignUpMethodEnum, UserType } from "@movie-tracker/types"
import { CanActivate } from "@nestjs/common"
import { EmailNotConfirmedError } from "@/shared/errors/auth"

export class EmailConfirmedGuard implements CanActivate {
  canActivate(context) {
    const request = context.switchToHttp().getRequest()
    const user = request.session.user as Omit<UserType, "password">

    if ((user && user?.isEmailVerified) || (user.signUpMethod !== SignUpMethodEnum.EMAIL)) {
      return true
    }

    throw new EmailNotConfirmedError()
  }
}
