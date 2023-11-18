import { BaseService } from './base';
import { BaseUserInfoType } from '@/routes/auth/providers/services/types/baseUserInfo.type';
import { ProviderOptsType } from '@/routes/auth/providers/services/types/providerOpts.type';
export declare class YandexProvider extends BaseService {
    constructor(opts: ProviderOptsType);
    extractUserInfo(data: YandexProfile): Promise<BaseUserInfoType>;
}
interface YandexProfile {
    login: string;
    id: string;
    client_id: string;
    psuid: string;
    emails?: string[];
    default_email?: string;
    is_avatar_empty?: boolean;
    default_avatar_id?: string;
    birthday?: string | null;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    real_name?: string;
    sex?: 'male' | 'female' | null;
    default_phone?: {
        id: number;
        number: string;
    };
    access_token: string;
    refresh_token?: string;
}
export {};
