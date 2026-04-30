import { PaginatedResDto } from "@/shared/dto/paginated.res.dto"
import { MediaRatingResDto } from "./mediaRating.res.dto"

export class MediaRatingPaginatedResDto extends PaginatedResDto(MediaRatingResDto) {}
