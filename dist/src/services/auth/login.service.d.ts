export declare function loginUser(email: string, password: string): Promise<{
    accessToken: string;
    user: {
        id: number;
        email: string;
        createdAt: Date;
    };
    refreshToken: string;
}>;
//# sourceMappingURL=login.service.d.ts.map