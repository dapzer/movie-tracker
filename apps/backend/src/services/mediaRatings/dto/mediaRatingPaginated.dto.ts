import { PaginatedDto } from "@/shared/dto/paginated.dto"
import { MediaRatingDto } from "./mediaRating.dto"

export class MediaRatingPaginatedDto extends PaginatedDto(MediaRatingDto) {}
