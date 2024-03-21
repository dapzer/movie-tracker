import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { join, resolve } from 'path';
import { createReadStream, statSync } from 'fs';
import { createGunzip } from 'zlib';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { Worker } from 'worker_threads';
import { getMillisecondsFromDays } from '@/shared/utils/getMillisecondsFromDays';

@Injectable()
export class SitemapService {
  worker = new Worker(resolve(__dirname, 'sitemapWorker.js'));

  constructor(private readonly configService: ConfigService) {}

  @Interval(getMillisecondsFromDays(7))
  autoGenerate() {
    if (this.configService.get('GENERATE_SITEMAP') === 'true') {
      this.generate();
    }
  }

  async generate() {
    this.worker.postMessage('generate');
  }

  async readFile(fileLocation: string) {
    try {
      const filePath = join(process.cwd(), 'sitemaps', fileLocation);

      statSync(filePath);

      const file = createReadStream(filePath);
      const gunzip = createGunzip();

      return file.pipe(gunzip);
    } catch (error) {
      throw error;
    }
  }
}
