import { Response, Request, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    id?: number;
}
export declare function ValidateUserRegistration(req: Request, res: Response, next: NextFunction): void;
export declare function ValidateLoginUser(req: Request, res: Response, next: NextFunction): void;
export declare function authenticateToken(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=validateUser.d.ts.map