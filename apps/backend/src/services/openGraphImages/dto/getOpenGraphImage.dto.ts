import { createZodDto } from "nestjs-zod"
import { z } from "zod"
import { zBooleanQuery } from "@/shared/dto/zod.utils"

const ALLOWED_IMAGE_ORIGINS = [
  "https://api.movie-tracker.app",
  "https://image.tmdb.org",
  // Local development
  "http://localhost:1337",
  "http://127.0.0.1:1337",
]

const zAllowedImageUrl = z.url().refine((value) => {
  try {
    const url = new URL(value)
    // Strip trailing dots to prevent bypasses like "example.com."
    url.hostname = url.hostname.replace(/\.+$/, "")

    return (url.protocol === "https:" || url.protocol === "http:") && ALLOWED_IMAGE_ORIGINS.includes(url.origin)
  }
  catch {
    return false
  }
}, { message: "Provided image URL is not allowed" })

const getOpenGraphImageSchema = z.object({
  imageUrl: zAllowedImageUrl.meta({ example: "https://api.movie-tracker.app/api/proxy/image/t/p/w500/poster.jpg" }),
  title: z.string().meta({ example: "My awesome media list" }),
  isAvatarPlaceholder: zBooleanQuery.optional().meta({ example: true }),
})

export class GetOpenGraphImageDto extends createZodDto(getOpenGraphImageSchema) {}
