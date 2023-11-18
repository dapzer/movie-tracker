import {
  HttpException,
  HttpStatus,
  Injectable,
  StreamableFile,
} from '@nestjs/common';

@Injectable()
export class ProxyService {
  async getResponse(url: string) {
    const response = await fetch(url);

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

  async getImage(url: string) {
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
      const file = new Uint8Array(buffer);
      const stream = new StreamableFile(file);

      return {
        stream,
        contentType,
      };
    } catch (err) {
      throw new HttpException(
        `Failed to process data received from remote server.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
