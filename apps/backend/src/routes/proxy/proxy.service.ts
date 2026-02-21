import { generateApiUrl } from "@movie-tracker/utils"
import { HttpException, HttpStatus, Injectable, StreamableFile } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as sharp from "sharp"

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
      throw new HttpException(
        `Failed to get data from remote server.`,
        HttpStatus.BAD_GATEWAY,
      )
    }

    if (!response.ok) {
      throw new HttpException(
        `${response.status}: Failed to get data from remote server.`,
        HttpStatus.BAD_GATEWAY,
      )
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
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async getImage(
    path: string,
    keepOriginalType: boolean = false,
    size: string = undefined,
  ) {
    const response = await fetch(
      `${this.configService.get("TMDB_IMAGE_API_URL")}/w500/${path}`,
    )

    if (!response.ok) {
      throw new HttpException(
        `${response.status}: Failed to get image from remote server.`,
        HttpStatus.BAD_GATEWAY,
      )
    }

    const contentType = response.headers.get("content-type")

    if (!contentType.includes("image")) {
      throw new HttpException(
        `Unsorted content type: ${contentType}.`,
        HttpStatus.BAD_REQUEST,
      )
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

      const stream = sharp(buffer).resize(Number(size)).webp()

      return {
        stream,
        contentType: "image/webp",
      }
    }
    catch {
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
