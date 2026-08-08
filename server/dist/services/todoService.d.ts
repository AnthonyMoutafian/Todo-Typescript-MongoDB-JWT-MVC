import { ReadDBService, type DBModels } from "./readDBService.js";
interface TodoBody {
    todo?: string;
}
export declare class TodoService extends ReadDBService {
    constructor(models: DBModels);
    getTodos(userId: string): Promise<import("../models/userModel.js").IUser>;
    addTodo(userId: string, body: TodoBody): Promise<void>;
    deleteTodo(userId: string, todoId: string): Promise<void>;
    doneTodo(userId: string, todoId: string): Promise<void>;
    editTodo(userId: string, todoId: string): Promise<void>;
    saveTodo(userId: string, todoId: string, body: TodoBody): Promise<void>;
    uploadTodoImage(userId: string, todoId: string, file: Express.Multer.File): Promise<{
        fileId: string;
        url: string;
    }>;
    deleteTodoImage(userId: string, todoId: string): Promise<void>;
}
export {};
//# sourceMappingURL=todoService.d.ts.map