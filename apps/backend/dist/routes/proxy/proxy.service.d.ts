import { StreamableFile } from '@nestjs/common';
export declare class ProxyService {
    getResponse(url: string): Promise<any>;
    getImage(url: string): Promise<{
        stream: StreamableFile;
        contentType: string;
    }>;
}
