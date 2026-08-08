import { type Request, type Response } from "express";

export class AuthController {
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await req.app.locals.services.auth.registerUser(req.body);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        user,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async loginUser(req: Request, res: Response): Promise<void> {
    try {
      const { accessToken, refreshToken } =
        await req.app.locals.services.auth.loginUser(req.body);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        accessToken,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async logoutUser(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.auth.logoutUser(res.locals.userId);

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.json({
        success: true,
        message: "Logged out",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Logout failed";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
        return;
      }

      const avatar = await req.app.locals.services.auth.uploadAvatar(
        res.locals.userId,
        req.file,
      );

      res.json({
        success: true,
        avatar,
      });
    } catch (err: unknown) {
      console.error(err);

      const message = err instanceof Error ? err.message : "Avatar upload failed";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async deleteAvatar(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.auth.deleteAvatar(res.locals.userId);

      res.json({
        success: true,
        message: "Avatar deleted",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Avatar deletion failed";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}