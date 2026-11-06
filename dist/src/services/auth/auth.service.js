"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.getUsers = getUsers;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = __importDefault(require("../../utils/prisma.js"));
async function registerUser(email, password) {
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    return await prisma_js_1.default.user.create({
        data: {
            email: email.trim().toLocaleLowerCase(),
            password: hashedPassword
        },
        select: {
            id: true,
            email: true,
            createdAt: true
        }
    });
}
/*
Understand the important parts
1. bcrypt.hash(password, 12) hashes the password using a cost factor of 12.
2. prisma.user.create() saves the new user in PostgreSQL.
3. select ensures the returned user object does not include the password hash.
4. Normalizing the email helps keep email addresses consistent.
*/
async function getUsers() {
    return await prisma_js_1.default.user.findMany();
}
//# sourceMappingURL=auth.service.js.map