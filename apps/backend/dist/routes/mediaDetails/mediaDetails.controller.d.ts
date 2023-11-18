import { MediaDetailsService } from '@/routes/mediaDetails/mediaDetails.service';
export declare class MediaDetailsController {
    private readonly mediaDetailsService;
    constructor(mediaDetailsService: MediaDetailsService);
    createOrUpdateAllMediaDetails(): Promise<{
        successfulUpdates: number;
        failedUpdatesByApi: number;
        failedUpdatesByDb: number;
    }>;
}
