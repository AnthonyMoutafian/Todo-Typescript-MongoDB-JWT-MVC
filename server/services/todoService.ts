import mongoose from "mongoose";

import { ReadDBService, type DBModels } from "./readDBService.js";
import googleDrive from "./googleDriveService.js";

interface TodoBody {
  todo?: string;
}

export class TodoService extends ReadDBService {
  constructor(models: DBModels) {
    super(models);
  }

  async getTodos(userId: string) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async addTodo(userId: string, body: TodoBody): Promise<void> {
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

  async deleteTodo(userId: string, todoId: string): Promise<void> {
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

  async doneTodo(userId: string, todoId: string): Promise<void> {
    if (!mongoose.isValidObjectId(todoId)) {
      return;
    }

    await this.updateUser(
      {
        _id: userId,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isChecked": true,
          "todos.$.isEditing": false,
        },
      },
    );
  }

  async editTodo(userId: string, todoId: string): Promise<void> {
    if (!mongoose.isValidObjectId(todoId)) {
      return;
    }

    await this.updateUser(
      {
        _id: userId,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isEditing": true,
        },
      },
    );
  }

  async saveTodo(
    userId: string,
    todoId: string,
    body: TodoBody,
  ): Promise<void> {
    if (!mongoose.isValidObjectId(todoId)) {
      return;
    }

    if (!body.todo || body.todo.trim() === "") {
      return;
    }

    await this.updateUser(
      {
        _id: userId,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.todo": body.todo.trim(),
          "todos.$.isEditing": false,
        },
      },
    );
  }

  async uploadTodoImage(
    userId: string,
    todoId: string,
    file: Express.Multer.File,
  ) {
    if (!mongoose.isValidObjectId(todoId)) {
      throw new Error("Invalid todo ID");
    }

    const uploaded = await googleDrive.uploadFile(file.path, file.filename);

    await this.updateTodoImage(userId, todoId, uploaded);

    return uploaded;
  }

  async deleteTodoImage(userId: string, todoId: string): Promise<void> {
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
