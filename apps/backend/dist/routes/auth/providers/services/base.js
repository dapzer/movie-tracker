"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const common_1 = require("@nestjs/common");
let BaseService = class BaseService {
    constructor(opts) {
        this.opts = opts;
    }
    async extractUserInfo(data) {
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
    async getUserByCode(code) {
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
            throw new common_1.HttpException({
                message: `Failed to fetch tokens from ${this.opts.access_url}`,
                data: await tokensRequest.text(),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const tokens = await tokensRequest.json();
        if (!tokens.access_token) {
            throw new common_1.HttpException({
                message: `No tokens ${this.opts.access_url}`,
                data: tokens,
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const userRequest = await fetch(this.opts.profile_url, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        });
        if (!userRequest.ok) {
            throw new common_1.HttpException({
                message: `Failed to fetch user from ${this.opts.profile_url}`,
                data: await userRequest.text(),
            }, common_1.HttpStatus.BAD_REQUEST);
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
    set baseUrl(value) {
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
};
exports.BaseService = BaseService;
exports.BaseService = BaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], BaseService);
//# sourceMappingURL=base.js.map