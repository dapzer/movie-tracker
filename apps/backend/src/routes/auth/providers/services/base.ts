import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BaseUserInfoType } from '@/routes/auth/providers/services/types/baseUserInfo.type';
import { BaseProviderOptsType } from '@/routes/auth/providers/services/types/baseProviderOpts.type';

@Injectable()
export class BaseService {
  private _baseUrl: string;

  constructor(private readonly opts: BaseProviderOptsType) {}

  protected async extractUserInfo(data: any): Promise<BaseUserInfoType> {
    return {
      ...data,
      provider: this.opts.name,
    };
  }

  getAuthUrl() {
    const query = new URLSearchParams({
      response_type: 'code',
      client_id: this.opts.client_id,
      redirect_uri: this.getRedirectUrl(),
      scope: (this.opts.scopes ?? []).join(' '),
      access_type: 'offline',
      prompt: 'select_account',
    });

    return `${this.opts.authorize_url}?${query}`;
  }

  async getUserByCode(code: string): Promise<BaseUserInfoType> {
    const client_id = this.opts.client_id;
    const client_secret = this.opts.client_secret;

    const tokensQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: 'authorization_code',
    });

    const tokensRequest = await fetch(this.opts.access_url, {
      method: 'POST',
      body: tokensQuery,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
    });

    if (!tokensRequest.ok) {
      throw new HttpException(
        {
          message: `Failed to fetch tokens from ${this.opts.access_url}`,
          data: await tokensRequest.text(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tokens = await tokensRequest.json();

    if (!tokens.access_token) {
      throw new HttpException(
        {
          message: `No tokens ${this.opts.access_url}`,
          data: tokens,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRequest = await fetch(this.opts.profile_url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userRequest.ok) {
      throw new HttpException(
        {
          message: `Failed to fetch user from ${this.opts.profile_url}`,
          data: await userRequest.text(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await userRequest.json();
    const userData = await this.extractUserInfo(user);

    return {
      ...userData,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || tokens.expires_in,
      provider: this.opts.name,
    };
  }

  getRedirectUrl() {
    return `${this._baseUrl}/auth/callback/${this.opts.name}`;
  }

  set baseUrl(value: string) {
    this._baseUrl = value;
  }

  get name() {
    return this.opts.name;
  }

  get access_url() {
    return this.opts.access_url;
  }

  get profile_url() {
    return this.opts.profile_url;
  }

  get scopes() {
    return this.opts.scopes;
  }
}
