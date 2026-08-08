import {} from "express";
export class TodoController {
    async getTodos(req, res) {
        try {
            const user = await req.app.locals.services.todos.getTodos(res.locals.userId);
            res.json({
                success: true,
                user: {
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    todos: user.todos,
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to get todos";
            res.status(500).json({
                success: false,
                message,
            });
        }
    }
    async addTodo(req, res) {
        try {
            await req.app.locals.services.todos.addTodo(res.locals.userId, req.body);
            res.status(201).json({
                success: true,
                message: "Todo added",
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to add todo";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async deleteTodo(req, res) {
        try {
            await req.app.locals.services.todos.deleteTodo(res.locals.userId, req.params.id);
            res.json({
                success: true,
                message: "Todo deleted",
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete todo";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async doneTodo(req, res) {
        try {
            await req.app.locals.services.todos.doneTodo(res.locals.userId, req.params.id);
            res.json({
                success: true,
                message: "Todo completed",
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to complete todo";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async editTodo(req, res) {
        try {
            await req.app.locals.services.todos.editTodo(res.locals.userId, req.params.id);
            res.json({
                success: true,
                message: "Todo editing enabled",
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to edit todo";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async saveTodo(req, res) {
        try {
            await req.app.locals.services.todos.saveTodo(res.locals.userId, req.params.id, req.body);
            res.json({
                success: true,
                message: "Todo saved",
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to save todo";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async uploadTodoImage(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    message: "Please select an image.",
                });
                return;
            }
            const image = await req.app.locals.services.todos.uploadTodoImage(res.locals.userId, req.params.id, req.file);
            res.json({
                success: true,
                message: "Image uploaded successfully.",
                image,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to upload image";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
    async deleteTodoImage(req, res) {
        try {
            await req.app.locals.services.todos.deleteTodoImage(res.locals.userId, req.params.id);
            res.json({
                success: true,
                message: "Image deleted successfully.",
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to delete image";
            res.status(400).json({
                success: false,
                message,
            });
        }
    }
}
//# sourceMappingURL=todoController.js.map