"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiVersion = apiVersion;
function apiVersion(req, res, next) {
    res.setHeader("X-API-Version", "1.0");
    next();
}
//# sourceMappingURL=apiVersion.js.map