"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertArrayToChunks = void 0;
const convertArrayToChunks = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
};
exports.convertArrayToChunks = convertArrayToChunks;
//# sourceMappingURL=convertArrayToChunks.js.map