import * as process from "node:process"
import { envSchema } from "@/shared/schemas/envSchema"

export const config = envSchema.parse(process.env)
