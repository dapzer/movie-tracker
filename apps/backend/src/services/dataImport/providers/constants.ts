import { FactoryProvider, ModuleMetadata } from "@nestjs/common"
import { BaseService } from "./services/base/base"

export const DataImportProvidersOptsSymbol = Symbol("DataImportProvidersOpts")

export interface Opts {
  services: BaseService[]
}

export type AsyncOpts = Pick<ModuleMetadata, "imports" | "providers">
  & Pick<FactoryProvider<Opts>, "useFactory" | "inject">
