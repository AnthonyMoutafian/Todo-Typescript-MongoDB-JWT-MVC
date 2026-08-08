import express from "express";
import { UsersController } from "../controllers/usersController.js";
import { checkAuth } from "../middleware/checkAuth.js";
const usersRouter = express.Router();
const usersController = new UsersController();
usersRouter.get("/users", checkAuth, usersController.getUsers.bind(usersController));
export default usersRouter;
//# sourceMappingURL=users.js.map