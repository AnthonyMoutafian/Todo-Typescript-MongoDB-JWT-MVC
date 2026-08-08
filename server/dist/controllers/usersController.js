import {} from "express";
export class UsersController {
    async getUsers(req, res) {
        try {
            const users = await req.app.locals.services.users.getUsers();
            res.json({
                success: true,
                users,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to get users";
            res.status(500).json({
                success: false,
                message,
            });
        }
    }
}
//# sourceMappingURL=usersController.js.map