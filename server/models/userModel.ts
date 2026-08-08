import mongoose, { Schema, type Document, type Model } from "mongoose";

import bcrypt from "bcryptjs";

export interface IImage {
  fileId: string;
  url: string;
}

export interface ITodo {
  _id?: mongoose.Types.ObjectId;
  todo: string;
  isChecked: boolean;
  isEditing: boolean;
  image?: IImage | null;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: IImage | null;
  todos: ITodo[];
  refreshToken?: string | null;
}

const imageSchema = new Schema<IImage>(
  {
    fileId: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const todoSchema = new Schema<ITodo>({
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

const userSchema = new Schema<IUser>({
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
      validator: function (value: string) {
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

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
