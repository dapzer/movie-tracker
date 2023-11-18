import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { MediaListDto } from '@/routes/mediaList/dto/mediaList.dto';

export class UpdateMediaListDto
  implements Pick<MediaListDto, 'title' | 'isPublic' | 'poster'>
{
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsString()
  poster: string;

  @IsOptional()
  @IsString()
  title: string;
}
