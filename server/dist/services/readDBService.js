export class ReadDBService {
    constructor(models) {
        this.models = models;
    }
    async getUsers() {
        return this.models.users.find();
    }
    async updateUser(filter, update) {
        return this.models.users.updateOne(filter, update);
    }
    async updateTodos(userId, update) {
        await this.updateUser({
            _id: userId,
        }, update);
    }
    async getUserById(userId) {
        return this.models.users.findById(userId);
    }
    async updateAvatar(userId, avatar) {
        return this.updateUser({
            _id: userId,
        }, {
            $set: {
                avatar,
            },
        });
    }
    async updateTodoImage(userId, todoId, image) {
        return this.updateUser({
            _id: userId,
            "todos._id": todoId,
        }, {
            $set: {
                "todos.$.image": image,
            },
        });
    }
}
//# sourceMappingURL=readDBService.js.map