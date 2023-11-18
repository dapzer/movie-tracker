import { BaseService } from './base';
import { BaseUserInfoType } from '@/routes/auth/providers/services/types/baseUserInfo.type';
import { ProviderOptsType } from '@/routes/auth/providers/services/types/providerOpts.type';
export declare class GoogleProvider extends BaseService {
    constructor(opts: ProviderOptsType);
    extractUserInfo(data: GoogleProfile): Promise<BaseUserInfoType>;
}
interface GoogleProfile extends Record<string, any> {
    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name?: string;
    given_name: string;
    hd?: string;
    iat: number;
    iss: string;
    jti?: string;
    locale?: string;
    name: string;
    nbf?: number;
    picture: string;
    sub: string;
    access_token: string;
    refresh_token?: string;
}
export {};
