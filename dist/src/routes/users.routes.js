"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateUser_js_1 = require("../middleware/userValidations/validateUser.js");
const user_controller_js_1 = require("../controllers/users/user.controller.js");
const router = (0, express_1.Router)();
/**
 Create Your APi's here
 */
// Get All users: '/api/v1/auth'
router.get('/', user_controller_js_1.GetAllUsersHandler);
// Login: '/api/v1/auth/login'
router.post('/login', validateUser_js_1.ValidateLoginUser, user_controller_js_1.loginRegisterUser);
// Logout: '/api/v1/auth/logout'
router.post('/logout', validateUser_js_1.ValidateLoginUser, user_controller_js_1.logoutUser);
// Post a user: '/api/v1/auth/register'
router.post('/register', validateUser_js_1.ValidateUserRegistration, user_controller_js_1.RegisterUserHandler);
// Refresh token Api: '/api/v1/auth/refresh'
router.post('/refresh', validateUser_js_1.ValidateLoginUser, user_controller_js_1.refreshAccessToken);
exports.default = router;
//# sourceMappingURL=users.routes.js.map