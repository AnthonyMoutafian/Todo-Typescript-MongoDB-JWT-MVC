import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt, {} from "jsonwebtoken";
import { ReadDBService } from "./readDBService.js";
import schema from "../schema/schema.js";
import googleDrive from "./googleDriveService.js";
export class AuthServices extends ReadDBService {
    constructor(models) {
        super(models);
    }
    createAccessToken(userId) {
        const secret = process.env.ACCESS_SECRET;
        if (!secret) {
            throw new Error("ACCESS_SECRET is not defined");
        }
        return jwt.sign({
            id: userId,
            jti: crypto.randomUUID(),
        }, secret, {
            expiresIn: "15m",
        });
    }
    createRefreshToken(userId) {
        const secret = process.env.REFRESH_SECRET;
        if (!secret) {
            throw new Error("REFRESH_SECRET is not defined");
        }
        return jwt.sign({
            id: userId,
            jti: crypto.randomUUID(),
        }, secret, {
            expiresIn: "7d",
        });
    }
    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new Error("Unauthorized");
        }
        try {
            const secret = process.env.REFRESH_SECRET;
            if (!secret) {
                throw new Error("REFRESH_SECRET is not defined");
            }
            const payload = jwt.verify(refreshToken, secret);
            if (!payload.id) {
                throw new Error("Unauthorized");
            }
            const user = await this.getUserById(payload.id);
            if (!user) {
                throw new Error("Unauthorized");
            }
            if (user.refreshToken !== refreshToken) {
                throw new Error("Unauthorized");
            }
            return this.createAccessToken(user._id.toString());
        }
        catch (err) {
            throw new Error("Unauthorized");
        }
    }
    async uploadAvatar(userId, file) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const uploaded = await googleDrive.replaceFile(user.avatar?.fileId, file.path, file.filename, "avatar");
        await this.updateAvatar(userId, uploaded);
        return uploaded;
    }
    async registerUser(body) {
        const newUser = await schema.validateAsync(body);
        const exists = await this.models.users.findOne({
            email: newUser.email,
        });
        if (exists) {
            throw new Error("Email already exists");
        }
        newUser.todos = [];
        newUser.avatar = null;
        newUser.refreshToken = null;
        const createdUser = await this.models.users.create(newUser);
        const userObject = createdUser.toObject();
        const { password, refreshToken, ...user } = userObject;
        return user;
    }
    async loginUser(body) {
        const user = await this.models.users.findOne({
            email: body.email,
        });
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const validPassword = await bcrypt.compare(body.password, user.password);
        if (!validPassword) {
            throw new Error("Invalid email or password");
        }
        const userId = user._id.toString();
        const accessToken = this.createAccessToken(userId);
        const refreshToken = this.createRefreshToken(userId);
        await this.updateUser({
            _id: user._id,
        }, {
            $set: {
                refreshToken,
            },
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async logoutUser(userId) {
        await this.updateUser({
            _id: userId,
        }, {
            $set: {
                refreshToken: null,
            },
        });
        return true;
    }
    async deleteAvatar(userId) {
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        if (user.avatar?.fileId) {
            await googleDrive.deleteFile(user.avatar.fileId);
        }
        await this.updateAvatar(userId, null);
        return true;
    }
}
//# sourceMappingURL=authService.js.map