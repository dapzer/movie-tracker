import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import * as sharp from 'sharp';
import * as path from 'path';

@Injectable()
export class OpenGraphImageService {
  async getOpenGraphImage(title: string, imageUrl: string) {
    const [neueHaasUnicaItalic, inter] = await Promise.all([
      readFile(
        path.join(process.cwd(), 'assets/fonts/NeueHaasUnica-BoldItalic.ttf'),
      ),
      readFile(path.join(process.cwd(), 'assets/fonts/Inter-SemiBold.ttf')),
    ]);

    const svg = await satori(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            backgroundColor: '#0D0D0D',
            padding: '86px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '64px',
            color: '#fff',
            fontWeight: '600',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        fontFamily: 'Neue Haas Unica',
                        fontSize: '48px',
                        fontWeight: '700',
                        margin: '0',
                      },
                      children: 'Movie Tracker',
                    },
                  },
                  {
                    type: 'p',
                    props: {
                      style: {
                        fontSize: '48px',
                        margin: '0',
                        fontFamily: 'Inter',
                        fontWeight: '600',
                        maxWidth: '564px',
                      },
                      children: title,
                    },
                  },
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  width: '100%',
                  maxWidth: '400px',
                },
                children: [
                  {
                    type: 'img',
                    props: {
                      style: {
                        marginLeft: 'auto',
                        height: '100%',
                        objectFit: 'contain',
                      },
                      src: imageUrl,
                      alt: '',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        embedFont: true,
        debug: false,
        fonts: [
          {
            name: 'Neue Haas Unica',
            data: neueHaasUnicaItalic,
          },
          {
            name: 'Inter',
            data: inter,
            weight: 600,
            style: 'normal',
          },
        ],
      },
    );

    return sharp(Buffer.from(svg)).webp({ quality: 100 }).toBuffer();
  }
}
