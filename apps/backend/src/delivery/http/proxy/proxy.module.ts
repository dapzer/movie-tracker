import { Module } from "@nestjs/common"
import { ProxyController } from "@/delivery/http/proxy/proxy.controller"
import { ProxyServiceModule } from "@/services/proxy/proxy.module"

@Module({
  imports: [ProxyServiceModule],
  controllers: [ProxyController],
})
export class ProxyHttpModule {}
