"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YandexProvider = void 0;
const base_1 = require("./base");
class YandexProvider extends base_1.BaseService {
    constructor(opts) {
        super({
            name: 'yandex',
            authorize_url: 'https://oauth.yandex.ru/authorize',
            access_url: 'https://oauth.yandex.ru/token',
            profile_url: 'https://login.yandex.ru/info?format=json',
            scopes: opts.scopes,
            client_id: opts.client_id,
            client_secret: opts.client_secret,
        });
    }
    async extractUserInfo(data) {
        return super.extractUserInfo({
            id: data.id,
            avatarUrl: data.default_avatar_id
                ? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
                : undefined,
            name: data.real_name ?? data.display_name ?? data.login,
            email: data.emails?.[0] ?? data.default_email,
        });
    }
}
exports.YandexProvider = YandexProvider;
//# sourceMappingURL=yandexProvider.js.map