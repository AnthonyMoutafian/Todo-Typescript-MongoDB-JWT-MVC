import type { Model } from "mongoose";
import type { IUser } from "../models/userModel.js";

export interface DBModels {
  users: Model<IUser>;
}

export class ReadDBService {
  protected models: DBModels;

  constructor(models: DBModels) {
    this.models = models;
  }

  async getUsers(): Promise<IUser[]> {
    return this.models.users.find();
  }

  async updateUser(
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
  ) {
    return this.models.users.updateOne(filter, update);
  }

  async updateTodos(
    userId: string,
    update: Record<string, unknown>,
  ): Promise<void> {
    await this.updateUser(
      {
        _id: userId,
      },
      update,
    );
  }

  async getUserById(userId: string): Promise<IUser | null> {
    return this.models.users.findById(userId);
  }

  async updateAvatar(
    userId: string,
    avatar: IUser["avatar"],
  ) {
    return this.updateUser(
      {
        _id: userId,
      },
      {
        $set: {
          avatar,
        },
      },
    );
  }

  async updateTodoImage(
    userId: string,
    todoId: string,
    image: IUser["todos"][number]["image"],
  ) {
    return this.updateUser(
      {
        _id: userId,
        "todos._id": todoId,
      },
      {
        $set: {
          "todos.$.image": image,
        },
      },
    );
  }
}
