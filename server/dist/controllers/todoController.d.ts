import { type Request, type Response } from "express";
export declare class TodoController {
    getTodos(req: Request, res: Response): Promise<void>;
    addTodo(req: Request, res: Response): Promise<void>;
    deleteTodo(req: Request, res: Response): Promise<void>;
    doneTodo(req: Request, res: Response): Promise<void>;
    editTodo(req: Request, res: Response): Promise<void>;
    saveTodo(req: Request, res: Response): Promise<void>;
    uploadTodoImage(req: Request, res: Response): Promise<void>;
    deleteTodoImage(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=todoController.d.ts.map