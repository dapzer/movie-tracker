import type { RequestOptions, SearchParams } from "./fetchClientTypes"
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

    for (const key in { ...this.params, ...params }) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key]

        if (Array.isArray(value)) {
          value.forEach((currentValue) => {
            if (currentValue) {
              searchParams.append(key, currentValue.toString())
            }
          })
        }
        else if (value) {
          searchParams.set(key, value.toString())
        }
      }
    }

    return `?${searchParams.toString()}`
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

    const config: RequestInit = {
      ...options,
      ...(!!this.options && { ...this.options }),
      method,
      headers: {
        ...(!!options?.headers && options.headers),
        ...this.headers,
      },
    }

    const response: Response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json() as { message: string } | undefined
      throw new FetchError(response.status, error?.message || response.statusText)
    }

    if (response.headers.get("Content-Type")?.includes("application/json")) {
      return (await response.json()) as unknown as T
    }
    else {
      return (await response.text()) as unknown as T
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
