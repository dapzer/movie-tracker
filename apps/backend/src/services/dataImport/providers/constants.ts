import { FactoryProvider, ModuleMetadata } from "@nestjs/common"
import { BaseProvider } from "./services/base/baseProvider"

export const DataImportProvidersOptsSymbol = Symbol("DataImportProvidersOpts")

export interface Opts {
  services: BaseProvider[]
}

export type AsyncOpts = Pick<ModuleMetadata, "imports">
  & Pick<FactoryProvider<Opts>, "useFactory" | "inject">
