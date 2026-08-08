import { type Request, type Response } from "express";
export declare class AuthController {
    registerUser(req: Request, res: Response): Promise<void>;
    loginUser(req: Request, res: Response): Promise<void>;
    logoutUser(req: Request, res: Response): Promise<void>;
    uploadAvatar(req: Request, res: Response): Promise<void>;
    deleteAvatar(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map