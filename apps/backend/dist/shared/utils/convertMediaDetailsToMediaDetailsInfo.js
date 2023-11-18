"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMediaDetailsToMediaDetailsInfo = void 0;
const convertMediaDetailsToMediaDetailsInfo = (details) => {
    return {
        originalTitle: details?.original_title || details?.original_name,
        title: details?.title || details?.name,
        poster: details?.poster_path,
        seasons: details?.seasons,
    };
};
exports.convertMediaDetailsToMediaDetailsInfo = convertMediaDetailsToMediaDetailsInfo;
//# sourceMappingURL=convertMediaDetailsToMediaDetailsInfo.js.map