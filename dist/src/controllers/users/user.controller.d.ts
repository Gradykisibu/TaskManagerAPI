import type { Response, Request, NextFunction } from "express";
export declare function RegisterUserHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function GetAllUsersHandler(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export declare function loginRegisterUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logoutUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function refreshAccessToken(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map