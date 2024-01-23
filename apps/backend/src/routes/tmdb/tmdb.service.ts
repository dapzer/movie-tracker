import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { unzip } from 'node:zlib';
import { promisify } from 'node:util';
import { ConfigService } from '@nestjs/config';

const unzipAsync = promisify(unzip);
const idRegex = /"id":(\d+)/g;

@Injectable()
export class TmdbService {
  private readonly mediaTypes = [
    {
      folder: 'movie',
      type: 'movie',
    },
    {
      folder: 'tv',
      type: 'tv_series',
    },
    {
      folder: 'person',
      type: 'person',
    },
  ];

  constructor(private readonly configService: ConfigService) {}

  private formatDate(dayBeforeToday: number = 0) {
    const dateNow = new Date();
    const date = new Date(dateNow.setDate(dateNow.getDate() - dayBeforeToday));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${month.toString().padStart(2, '0')}_${day
      .toString()
      .padStart(2, '0')}_${year}`;
  }

  async getDailyIdExport() {
    const result = {
      movie: [],
      tv: [],
      person: [],
    };

    for (const mediaType of this.mediaTypes) {
      let data;
      let trys = 0;

      while (true) {
        const fileName = `${mediaType.type}_ids_${this.formatDate(
          trys,
        )}.json.gz`;

        const response = await fetch(
          `${this.configService.get('TMDB_FILES_API_URL')}/${fileName}`,
        );

        if (response.ok) {
          data = response;
          break;
        } else if (trys <= 7) {
          trys += 1;
        } else {
          throw new HttpException(
            `${response.status}: Failed to get data from TMDB.`,
            HttpStatus.BAD_GATEWAY,
          );
        }
      }

      const body = await data.arrayBuffer();
      const fetchedData = await unzipAsync(body);
      const parsedData = fetchedData.toString();

      const ids = [];
      const matches = parsedData.matchAll(idRegex);

      for (const match of matches) {
        ids.push(match[1]);
      }

      result[mediaType.folder] = ids;
    }

    return result;
  }
}
