import { type Request, type Response } from "express";

export class UsersController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await req.app.locals.services.users.getUsers();

      res.json({
        success: true,
        users,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to get users";

      res.status(500).json({
        success: false,
        message,
      });
    }
  }
}
