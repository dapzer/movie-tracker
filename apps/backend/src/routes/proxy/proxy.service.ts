import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { generateApiUrl } from '@movie-tracker/utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProxyService {
  getApiUrl = generateApiUrl(this.configService.get('TMDB_API_URL') || '', {
    api_key: this.configService.get('TMDB_API_KEY') || '',
  });

  constructor(private readonly configService: ConfigService) {}

  async getResponse(path: string, queries?: Record<string, string>) {
    let response: Response | undefined = undefined;

    try {
      response = await fetch(this.getApiUrl(`/${path}`, queries));
    } catch (err) {
      throw new HttpException(
        `Failed to get data from remote server.`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!response.ok) {
      throw new HttpException(
        `${response.status}: Failed to get data from remote server.`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    try {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') !== -1) {
        const res = await response.json();

        return res;
      } else {
        const res = await response.text();

        return {
          data: res,
        };
      }
    } catch (err) {
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImage(path: string, size: string = undefined) {
    const response = await fetch(
      `${this.configService.get('TMDB_IMAGE_API_URL')}/w500/${path}`,
    );

    if (!response.ok) {
      throw new HttpException(
        `${response.status}: Failed to get image from remote server.`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    const contentType = response.headers.get('content-type');

    if (!contentType.includes('image')) {
      throw new HttpException(
        `Unsorted content type: ${contentType}.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const buffer = await response.arrayBuffer();
      return sharp(buffer).resize(Number(size)).webp().toBuffer();
    } catch (err) {
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
