export declare function createRefreshToken(userId: number): Promise<{
    token: string;
    expiresAt: Date;
}>;
export declare function validateRefreshToken(refreshToken: string): Promise<{
    id: number;
    tokenHash: string;
    userId: number;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
} | null>;
export declare function rotateRefreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
} | null>;
export declare function revokeRefreshToken(refreshToken: string): Promise<true | null>;
//# sourceMappingURL=refreshToken.service.d.ts.map