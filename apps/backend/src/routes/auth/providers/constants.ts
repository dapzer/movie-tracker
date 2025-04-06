import { FactoryProvider, ModuleMetadata } from "@nestjs/common"
import { BaseService } from "./services/base"

export const ProvidersOptsSymbol = Symbol()

export interface Opts {
  baseUrl: string
  services: BaseService[]
}

export type AsyncOpts = Pick<ModuleMetadata, "imports"> &
  Pick<FactoryProvider<Opts>, "useFactory" | "inject">
