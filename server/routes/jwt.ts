import express, { type Request, type Response } from "express";

const router = express.Router();

router.post(
  "/refresh",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "No refresh token",
        });
        return;
      }

      const accessToken =
        await req.app.locals.services.auth.refreshAccessToken(
          refreshToken,
        );

      res.json({
        success: true,
        accessToken,
      });
    } catch (err: unknown) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
  },
);

export default router;