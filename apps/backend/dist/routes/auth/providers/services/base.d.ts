import { BaseUserInfoType } from '@/routes/auth/providers/services/types/baseUserInfo.type';
import { BaseProviderOptsType } from '@/routes/auth/providers/services/types/baseProviderOpts.type';
export declare class BaseService {
    private readonly opts;
    private _baseUrl;
    constructor(opts: BaseProviderOptsType);
    protected extractUserInfo(data: any): Promise<BaseUserInfoType>;
    getAuthUrl(): string;
    getUserByCode(code: string): Promise<BaseUserInfoType>;
    getRedirectUrl(): string;
    set baseUrl(value: string);
    get name(): string;
    get access_url(): string;
    get profile_url(): string;
    get scopes(): string[];
}
