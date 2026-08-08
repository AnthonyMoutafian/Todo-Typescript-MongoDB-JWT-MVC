import express from "express";
import {} from "express";
const indexRouter = express.Router();
import { checkAuth } from "../middleware/checkAuth.js";
indexRouter.get("/", function (req, res) {
    res.render("index");
});
indexRouter.get("/register", function (req, res) {
    res.render("register");
});
indexRouter.get("/login", function (req, res) {
    res.render("login");
});
indexRouter.get("/todo", checkAuth, async (req, res) => {
    try {
        const user = await req.app.locals.services.auth.populate(res.locals.userId);
        res.render("todo", {
            todos: user.todos,
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});
export default indexRouter;
//# sourceMappingURL=index.js.map