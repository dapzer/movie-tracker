import { parentPort } from 'worker_threads';
import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { GenerateDetailsSitemapService } from '@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service';

const configService = new ConfigService();
const generateDetailsSitemapService = new GenerateDetailsSitemapService(
  configService,
);

parentPort.on('message', async (message) => {
  if (message === 'generate') {
    await generateDetailsSitemapService.generate();
  }
});
