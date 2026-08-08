import { type Request, type Response } from "express";

export class TodoController {
  async getTodos(req: Request, res: Response): Promise<void> {
    try {
      const user = await req.app.locals.services.todos.getTodos(
        res.locals.userId,
      );

      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          todos: user.todos,
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to get todos";

      res.status(500).json({
        success: false,
        message,
      });
    }
  }

  async addTodo(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.todos.addTodo(
        res.locals.userId,
        req.body,
      );

      res.status(201).json({
        success: true,
        message: "Todo added",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add todo";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.todos.deleteTodo(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Todo deleted",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete todo";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async doneTodo(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.todos.doneTodo(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Todo completed",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to complete todo";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async editTodo(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.todos.editTodo(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Todo editing enabled",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to edit todo";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async saveTodo(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.todos.saveTodo(
        res.locals.userId,
        req.params.id,
        req.body,
      );

      res.json({
        success: true,
        message: "Todo saved",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save todo";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async uploadTodoImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
        return;
      }

      const image = await req.app.locals.services.todos.uploadTodoImage(
        res.locals.userId,
        req.params.id,
        req.file,
      );

      res.json({
        success: true,
        message: "Image uploaded successfully.",
        image,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async deleteTodoImage(req: Request, res: Response): Promise<void> {
    try {
      await req.app.locals.services.todos.deleteTodoImage(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Image deleted successfully.",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete image";

      res.status(400).json({
        success: false,
        message,
      });
    }
  }
}