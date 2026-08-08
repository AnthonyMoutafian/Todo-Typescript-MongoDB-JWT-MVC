import express, {} from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/userModel.js";
import { AuthServices } from "./services/authService.js";
import { TodoService } from "./services/todoService.js";
import { ReadDBService } from "./services/readDBService.js";
import authRouter from "./routes/auth.js";
import todoRouter from "./routes/todo.js";
import usersRouter from "./routes/users.js";
import jwtRouter from "./routes/jwt.js";
const app = express();
const port = Number(process.env.PORT) || 3000;
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in .env");
}
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.locals.models = {
    users: User,
};
const authService = new AuthServices(app.locals.models);
const todoService = new TodoService(app.locals.models);
const usersService = new ReadDBService(app.locals.models);
app.locals.services = {
    auth: authService,
    todos: todoService,
    users: usersService,
};
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
    });
});
app.use("/api", authRouter);
app.use("/api/todo", todoRouter);
app.use("/api", usersRouter);
app.use("/api", jwtRouter);
mongoose
    .connect(mongoUri)
    .then(() => {
    console.log("DB CONNECTED");
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
})
    .catch((err) => {
    const message = err instanceof Error ? err.message : "Unknown database error";
    console.error("Database connection failed:", message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map