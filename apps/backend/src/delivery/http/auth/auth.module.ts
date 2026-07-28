import { Module } from "@nestjs/common"
import { AuthController } from "@/delivery/http/auth/auth.controller"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { AuthServiceModule } from "@/services/auth/auth.module"

@Module({
  imports: [AuthServiceModule],
  controllers: [AuthController],
  providers: [ThrottlerBehindProxyGuard],
})
export class AuthModule {}
