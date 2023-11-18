"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubProvider = void 0;
const base_1 = require("./base");
class GithubProvider extends base_1.BaseService {
    constructor(opts) {
        super({
            name: 'github',
            authorize_url: 'https://github.com/login/oauth/authorize',
            access_url: 'https://github.com/login/oauth/access_token',
            profile_url: 'https://api.github.com/user',
            scopes: opts.scopes,
            client_id: opts.client_id,
            client_secret: opts.client_secret,
        });
    }
    async extractUserInfo(data) {
        return super.extractUserInfo({
            id: data.id.toString(),
            avatarUrl: data.avatar_url,
            name: data.name ?? data.login,
            email: data.email,
        });
    }
}
exports.GithubProvider = GithubProvider;
//# sourceMappingURL=githubProvider.js.map