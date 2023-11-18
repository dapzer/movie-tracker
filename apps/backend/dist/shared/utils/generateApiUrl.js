"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiUrl = void 0;
const generateApiUrl = (url, defaultQueries) => {
    return (path, queries) => {
        const apiUrl = new URL(url + path);
        Object.entries({ ...queries, ...defaultQueries }).forEach(([key, value]) => {
            apiUrl.searchParams.append(key, value.toString());
        });
        return apiUrl.href;
    };
};
exports.generateApiUrl = generateApiUrl;
//# sourceMappingURL=generateApiUrl.js.map