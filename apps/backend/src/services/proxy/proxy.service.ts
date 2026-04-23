import { generateApiUrl, HttpStatus } from "@movie-tracker/utils"
import { Injectable, StreamableFile } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as sharp from "sharp"
import {
  ProxyFetchError,
  ProxyFetchNotFoundError,
  ProxyImageFetchError,
  ProxyImageNotFoundError,
  ProxyProcessingError,
  ProxyUnsupportedContentTypeError,
} from "@/shared/errors/proxy"

@Injectable()
export class ProxyService {
  getApiUrl = generateApiUrl(this.configService.get("TMDB_API_URL") || "", {
    api_key: this.configService.get("TMDB_API_KEY") || "",
  })

  constructor(private readonly configService: ConfigService) {}

  async getData(path: string, queries?: Record<string, string>) {
    let response: Response | undefined

    try {
      response = await fetch(this.getApiUrl(`/${path}`, queries))
    }
    catch {
      throw new ProxyFetchError({ path })
    }

    if (!response.ok) {
      if (response.status === HttpStatus.NOT_FOUND) {
        throw new ProxyFetchNotFoundError({ path })
      }

      throw new ProxyFetchError({ path, statusCode: response.status })
    }

    try {
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        const res = await response.json()

        return res
      }
      else {
        const res = await response.text()

        return {
          data: res,
        }
      }
    }
    catch {
      throw new ProxyProcessingError({ path })
    }
  }

  async getImage(
    path: string,
    keepOriginalType: boolean = false,
    size: number = undefined,
  ) {
    const response = await fetch(
      `${this.configService.get("TMDB_IMAGE_API_URL")}/w500/${path}`,
    )

    if (!response.ok) {
      if (response.status === HttpStatus.NOT_FOUND) {
        throw new ProxyImageNotFoundError({ path })
      }
      throw new ProxyImageFetchError({ path, statusCode: response.status })
    }

    const contentType = response.headers.get("content-type")

    if (!contentType.includes("image")) {
      throw new ProxyUnsupportedContentTypeError({ contentType })
    }

    try {
      const buffer = await response.arrayBuffer()

      if (keepOriginalType) {
        const file = new Uint8Array(buffer)
        const stream = new StreamableFile(file).getStream()

        return { stream, contentType }
      }

      if (!size) {
        const stream = sharp(buffer).webp()

        return {
          stream,
          contentType: "image/webp",
        }
      }

      const stream = sharp(buffer).resize(size).webp()

      return {
        stream,
        contentType: "image/webp",
      }
    }
    catch {
      throw new ProxyProcessingError({ path })
    }
  }
}
