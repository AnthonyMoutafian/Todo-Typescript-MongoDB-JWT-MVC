import jwt, { type JwtPayload } from "jsonwebtoken";
import {
  type Request,
  type Response,
  type NextFunction,
} from "express";

interface AccessTokenPayload extends JwtPayload {
  id: string;
}

export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const token = authHeader.replace(/^Bearer\s/, "");

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET as string,
    ) as AccessTokenPayload;

    res.locals.userId = decoded.id;

    next();
  } catch (err: unknown) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};