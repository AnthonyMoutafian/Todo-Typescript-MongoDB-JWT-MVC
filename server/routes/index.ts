import express from "express";
import { type Request, type Response } from "express";
const indexRouter = express.Router();
import {checkAuth} from "../middleware/checkAuth.js";

indexRouter.get("/", function (req: Request, res: Response) {
  res.render("index");
});

indexRouter.get("/register", function (req: Request, res: Response) {
  res.render("register");
});

indexRouter.get("/login", function (req: Request, res: Response) {
  res.render("login");
});

indexRouter.get("/todo", checkAuth, async (req: Request, res: Response) => {
  try {
    const user = await req.app.locals.services.auth.populate(res.locals.userId);

    res.render("todo", {
      todos: user.todos,
    });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
});



export default indexRouter