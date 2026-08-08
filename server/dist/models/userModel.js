import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
const imageSchema = new Schema({
    fileId: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
}, {
    _id: false,
});
const todoSchema = new Schema({
    todo: {
        type: String,
        required: true,
        trim: true,
    },
    isChecked: {
        type: Boolean,
        default: false,
    },
    isEditing: {
        type: Boolean,
        default: false,
    },
    image: {
        type: imageSchema,
        default: null,
    },
});
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function (value) {
                return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
            },
            message: "Password must contain lowercase, uppercase, and a number",
        },
    },
    avatar: {
        type: imageSchema,
        default: null,
    },
    todos: {
        type: [todoSchema],
        default: [],
    },
    refreshToken: {
        type: String,
        default: null,
    },
});
userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 10);
});
const User = mongoose.model("User", userSchema);
export default User;
//# sourceMappingURL=userModel.js.map