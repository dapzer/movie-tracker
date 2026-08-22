import type { RequestOptions, RetryRule, RetryRules, SearchParams } from "./fetchClientTypes"
import { getMillisecondsFromSeconds } from "../getMillisecondsFromSeconds"
import { HttpStatusValue } from "../HttpStatus"
import { FetchError } from "./featchError"

export class FetchClient {
  private baseUrl: string | (() => string)
  public headers?: Record<string, string>
  public params?: SearchParams
  public options?: RequestOptions

  constructor(init: {
    baseUrl: string | (() => string)
    headers?: Record<string, string>
    params?: SearchParams
    options?: RequestOptions
  }) {
    this.baseUrl = init.baseUrl
    this.headers = init.headers
    this.params = init.params
    this.options = init.options
  }

  private createSearchParams(params: SearchParams) {
    const searchParams = new URLSearchParams()
    const allParams = { ...this.params, ...params }

    for (const key in { ...this.params, ...params }) {
      const value = allParams[key]

      if (value === undefined || value === null) {
        continue
      }

      if (Array.isArray(value)) {
        value.forEach((currentValue) => {
          if (currentValue !== undefined && currentValue !== null) {
            searchParams.append(key, currentValue.toString())
          }
        })
      }
      else {
        searchParams.set(key, value.toString())
      }
    }

    if (!searchParams.toString()?.length) {
      return ""
    }

    return `?${searchParams.toString()}`
  }

  private resolveRetryRule(error: FetchError, rules?: RetryRules): RetryRule | undefined {
    const rule = rules?.[error.statusCode as HttpStatusValue]

    if (rule === undefined) {
      return undefined
    }

    return typeof rule === "number" ? { retries: rule } : rule
  }

  private getRetryDelay(rule: RetryRule, attempt: number, error: FetchError): number {
    let delay: number

    if (typeof rule.delay === "function") {
      delay = rule.delay({ attempt, error })
    }
    else if (typeof rule.delay === "number") {
      delay = rule.delay
    }
    else {
      delay = getMillisecondsFromSeconds(2) ** (attempt || 1)
    }

    const retryAfter = Number(error.headers?.["retry-after"])

    if (Number.isFinite(retryAfter) && retryAfter > 0) {
      delay = Math.max(delay, retryAfter * 1000)
    }

    return delay
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (response.headers.get("Content-Type")?.includes("application/json")) {
      return (await response.json()) as unknown as T
    }

    return (await response.text()) as unknown as T
  }

  private async request<T>(
    endpoint: string,
    method: RequestInit["method"],
    options: RequestOptions = {},
  ) {
    const baseUrl = typeof this.baseUrl === "function" ? this.baseUrl() : this.baseUrl
    let url = `${baseUrl}/${endpoint}`

    if (options.params) {
      url += this.createSearchParams(options.params)
    }

    const { params: _, retries, ...restOptions } = options

    const config: RequestInit = {
      ...restOptions,
      ...(!!this.options && { ...this.options }),
      method,
      headers: {
        ...(!!options?.headers && options.headers),
        ...this.headers,
      },
    }

    let attempt = 0

    while (true) {
      const response: Response = await fetch(url, config)

      if (response.ok) {
        return this.parseResponse<T>(response)
      }

      const errorBody = await response.json() as { message: string } | undefined
      const error = new FetchError(response.status, errorBody?.message || response.statusText, Object.fromEntries(response.headers))
      const retryRule = this.resolveRetryRule(error, retries)

      if (!retryRule || attempt >= retryRule.retries) {
        throw error
      }

      await new Promise(resolve => setTimeout(resolve, this.getRetryDelay(retryRule, attempt, error)))
      attempt += 1
    }
  }

  get<T>(endpoint: string, options: Omit<RequestOptions, "body"> = {}) {
    return this.request<T>(endpoint, "GET", options)
  }

  delete<T>(endpoint: string, options: Omit<RequestOptions, "body"> = {}) {
    return this.request<T>(endpoint, "DELETE", options)
  }

  post<T>(endpoint: string, body?: Record<string, any>, options: RequestOptions = {}) {
    return this.request<T>(endpoint, "POST", {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...(!!body && { body: JSON.stringify(body) }),
    })
  }

  put<T>(endpoint: string, body?: Record<string, any>, options: RequestOptions = {}) {
    return this.request<T>(endpoint, "PUT", {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...(!!body && { body: JSON.stringify(body) }),
    })
  }

  patch<T>(endpoint: string, body?: Record<string, any>, options: RequestOptions = {}) {
    return this.request<T>(endpoint, "PATCH", {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...(!!body && { body: JSON.stringify(body) }),
    })
  }
}
