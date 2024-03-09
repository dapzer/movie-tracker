import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ProxyService {
  async getResponse(url: string) {
    let response: Response | undefined = undefined;

    try {
      response = await fetch(url);
    } catch (err) {
      throw new HttpException(
        `Failed to get image from ${url}.`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    if (!response.ok) {
      throw new HttpException(
        `${response.status}: Failed to get data from ${url}.`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    try {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.indexOf('application/json') !== -1) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (err) {
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImage(url: string, size: string = undefined) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new HttpException(
        `${response.status}: Failed to get image from ${url}.`,
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
      const image = await sharp(buffer).resize(Number(size)).webp().toBuffer();

      return image;
    } catch (err) {
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
