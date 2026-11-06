"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = validateUser;
function validateUser(req, res, next) {
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return res.status(400).json({
            message: "You are not loggedIn"
        });
    }
    ;
    next();
}
//# sourceMappingURL=validateUser.js.map