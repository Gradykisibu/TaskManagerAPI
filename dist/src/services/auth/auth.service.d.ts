export declare function registerUser(email: string, password: string): Promise<{
    createdAt: Date;
    email: string;
    id: number;
}>;
export declare function getUsers(): Promise<{
    id: number;
    email: string;
    password: string;
    createdAt: Date;
}[]>;
//# sourceMappingURL=auth.service.d.ts.map