import { Router } from "express";
import { ValidateLoginUser, ValidateUserRegistration } from "../middleware/userValidations/validateUser.js";
import { RegisterUserHandler, GetAllUsersHandler, loginRegisterUser, refreshAccessToken, logoutUser} from "../controllers/users/user.controller.js";

const router = Router();
/**
 Create Your APi's here
 */

// Get All users: '/api/v1/auth'
router.get('/', GetAllUsersHandler)

// Login: '/api/v1/auth/login'
router.post('/login', ValidateLoginUser, loginRegisterUser)

// Logout: '/api/v1/auth/logout'
router.post('/logout', ValidateLoginUser, logoutUser)

// Post a user: '/api/v1/auth/register'
router.post('/register', ValidateUserRegistration, RegisterUserHandler)


// Refresh token Api: '/api/v1/auth/refresh'
router.post('/refresh', ValidateLoginUser,refreshAccessToken)


export default router;