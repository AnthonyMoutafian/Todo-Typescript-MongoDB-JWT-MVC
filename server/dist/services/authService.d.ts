import { ReadDBService } from "./readDBService.js";
interface AuthModels {
    users: any;
}
interface LoginBody {
    email: string;
    password: string;
}
interface ImageFile {
    fileId: string;
    url: string;
}
export declare class AuthServices extends ReadDBService {
    constructor(models: AuthModels);
    createAccessToken(userId: string): string;
    createRefreshToken(userId: string): string;
    refreshAccessToken(refreshToken: string): Promise<string>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<ImageFile>;
    registerUser(body: unknown): Promise<{
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: 'save' | 'validate' | 'remove' | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        name: string;
        email: string;
        avatar?: import("../models/userModel.js").IImage | null;
        todos: import("../models/userModel.js").ITodo[];
        __v: number;
    }>;
    loginUser(body: LoginBody): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logoutUser(userId: string): Promise<boolean>;
    deleteAvatar(userId: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=authService.d.ts.map