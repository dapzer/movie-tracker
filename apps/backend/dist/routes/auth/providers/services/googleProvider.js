"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleProvider = void 0;
const base_1 = require("./base");
class GoogleProvider extends base_1.BaseService {
    constructor(opts) {
        super({
            name: 'google',
            authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
            access_url: 'https://oauth2.googleapis.com/token',
            profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
            scopes: opts.scopes,
            client_id: opts.client_id,
            client_secret: opts.client_secret,
        });
    }
    async extractUserInfo(data) {
        return super.extractUserInfo({
            id: data.sub,
            avatarUrl: data.picture,
            name: data.name,
            email: data.email,
        });
    }
}
exports.GoogleProvider = GoogleProvider;
//# sourceMappingURL=googleProvider.js.map