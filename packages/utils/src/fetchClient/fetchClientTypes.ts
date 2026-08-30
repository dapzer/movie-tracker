import type { FetchError } from "./featchError"
import { HttpStatusValue } from "../HttpStatus"

export interface SearchParams { [key: string]: string | number | boolean | undefined | Array<string | number | boolean | undefined> }

export interface RetryRule {
  retries: number
  delay?: number | ((args: { attempt: number, error: FetchError }) => number)
}

export type RetryRules = Partial<Record<HttpStatusValue, number | RetryRule>>

export interface RequestOptions extends RequestInit {
  headers?: Record<string, string>
  params?: SearchParams
  retries?: RetryRules
}

export type FetchRequestConfig<Params = undefined> = Params extends undefined
  ? { config?: RequestOptions }
  : { params: Params, config?: RequestOptions }
