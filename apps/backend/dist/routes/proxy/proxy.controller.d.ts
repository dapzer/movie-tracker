import { ProxyService } from '@/routes/proxy/proxy.service';
import { ProxyQueriesDto } from '@/routes/proxy/dto/proxyQueries..dto';
import { Response } from 'express';
export declare class ProxyController {
    private readonly proxyService;
    constructor(proxyService: ProxyService);
    getResponse(queries: ProxyQueriesDto): Promise<any>;
    getImage(res: Response, queries: ProxyQueriesDto): Promise<Response<any, Record<string, any>>>;
}
