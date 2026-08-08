import express from "express";

import upload from "../middleware/upload.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { TodoController } from "../controllers/todoController.js";

const router = express.Router();

const controller = new TodoController();

router.use(checkAuth);

router.get("/", controller.getTodos.bind(controller));

router.post("/create", controller.addTodo.bind(controller));

router.post("/edit/:id", controller.editTodo.bind(controller));

router.post("/save/:id", controller.saveTodo.bind(controller));

router.post("/done/:id", controller.doneTodo.bind(controller));

router.post("/delete/:id", controller.deleteTodo.bind(controller));

router.put(
  "/:id/image",
  upload.single("image"),
  controller.uploadTodoImage.bind(controller),
);

router.delete("/:id/image", controller.deleteTodoImage.bind(controller));

export default router;
