import mongoose from "mongoose";
import { ReadDBService } from "./readDBService.js";
import googleDrive from "./googleDriveService.js";
export class TodoService extends ReadDBService {
    constructor(models) {
        super(models);
    }
    async getTodos(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }
    async addTodo(userId, body) {
        if (!body.todo || body.todo.trim() === "") {
            return;
        }
        const newTodo = {
            _id: new mongoose.Types.ObjectId(),
            todo: body.todo.trim(),
            isChecked: false,
            isEditing: false,
        };
        await this.updateTodos(userId, {
            $push: {
                todos: newTodo,
            },
        });
    }
    async deleteTodo(userId, todoId) {
        if (!mongoose.isValidObjectId(todoId)) {
            return;
        }
        const user = await this.getUserById(userId);
        if (!user) {
            return;
        }
        const todo = user.todos.find((todo) => todo._id?.toString() === todoId);
        if (!todo) {
            return;
        }
        if (todo.image?.fileId) {
            await googleDrive.deleteFile(todo.image.fileId);
        }
        await this.updateTodos(userId, {
            $pull: {
                todos: {
                    _id: new mongoose.Types.ObjectId(todoId),
                },
            },
        });
    }
    async doneTodo(userId, todoId) {
        if (!mongoose.isValidObjectId(todoId)) {
            return;
        }
        await this.updateUser({
            _id: userId,
            "todos._id": new mongoose.Types.ObjectId(todoId),
        }, {
            $set: {
                "todos.$.isChecked": true,
                "todos.$.isEditing": false,
            },
        });
    }
    async editTodo(userId, todoId) {
        if (!mongoose.isValidObjectId(todoId)) {
            return;
        }
        await this.updateUser({
            _id: userId,
            "todos._id": new mongoose.Types.ObjectId(todoId),
        }, {
            $set: {
                "todos.$.isEditing": true,
            },
        });
    }
    async saveTodo(userId, todoId, body) {
        if (!mongoose.isValidObjectId(todoId)) {
            return;
        }
        if (!body.todo || body.todo.trim() === "") {
            return;
        }
        await this.updateUser({
            _id: userId,
            "todos._id": new mongoose.Types.ObjectId(todoId),
        }, {
            $set: {
                "todos.$.todo": body.todo.trim(),
                "todos.$.isEditing": false,
            },
        });
    }
    async uploadTodoImage(userId, todoId, file) {
        if (!mongoose.isValidObjectId(todoId)) {
            throw new Error("Invalid todo ID");
        }
        const uploaded = await googleDrive.uploadFile(file.path, file.filename);
        await this.updateTodoImage(userId, todoId, uploaded);
        return uploaded;
    }
    async deleteTodoImage(userId, todoId) {
        if (!mongoose.isValidObjectId(todoId)) {
            return;
        }
        const user = await this.getUserById(userId);
        if (!user) {
            return;
        }
        const todo = user.todos.find((todo) => todo._id?.toString() === todoId);
        if (!todo?.image) {
            return;
        }
        await googleDrive.deleteFile(todo.image.fileId);
        await this.updateTodoImage(userId, todoId, null);
    }
}
//# sourceMappingURL=todoService.js.map