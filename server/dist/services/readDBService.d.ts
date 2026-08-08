import type { Model } from "mongoose";
import type { IUser } from "../models/userModel.js";
export interface DBModels {
    users: Model<IUser>;
}
export declare class ReadDBService {
    protected models: DBModels;
    constructor(models: DBModels);
    getUsers(): Promise<IUser[]>;
    updateUser(filter: Record<string, unknown>, update: Record<string, unknown>): Promise<import("mongoose").UpdateWriteOpResult>;
    updateTodos(userId: string, update: Record<string, unknown>): Promise<void>;
    getUserById(userId: string): Promise<IUser | null>;
    updateAvatar(userId: string, avatar: IUser["avatar"]): Promise<import("mongoose").UpdateWriteOpResult>;
    updateTodoImage(userId: string, todoId: string, image: IUser["todos"][number]["image"]): Promise<import("mongoose").UpdateWriteOpResult>;
}
//# sourceMappingURL=readDBService.d.ts.map