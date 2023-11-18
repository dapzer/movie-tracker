"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VkProvider = void 0;
const base_1 = require("./base");
class VkProvider extends base_1.BaseService {
    constructor(opts) {
        const vkApiVersion = '5.154';
        super({
            name: 'vk',
            authorize_url: `https://oauth.vk.com/authorize?v=${vkApiVersion}`,
            access_url: `https://oauth.vk.com/access_token?v=${vkApiVersion}`,
            profile_url: `https://api.vk.com/method/users.get?v=${vkApiVersion}`,
            scopes: opts.scopes,
            client_id: opts.client_id,
            client_secret: opts.client_secret,
        });
    }
    async extractUserInfo(data) {
        return super.extractUserInfo({
            id: data.response[0].id.toString(),
            avatarUrl: data.response[0].photo_100,
            name: `${data.response[0].first_name} ${data.response[0].last_name}`,
            email: '',
        });
    }
}
exports.VkProvider = VkProvider;
//# sourceMappingURL=vkProvider.js.map