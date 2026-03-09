import { Module } from "@nestjs/common"
import { ProxyService } from "@/services/proxy/proxy.service"

@Module({
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyServiceModule {}
