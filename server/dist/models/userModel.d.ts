import mongoose, { type Document, type Model } from "mongoose";
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
declare const User: Model<IUser>;
export default User;
//# sourceMappingURL=userModel.d.ts.map