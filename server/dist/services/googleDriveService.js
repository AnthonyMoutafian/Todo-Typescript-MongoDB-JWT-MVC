import fs from "fs";
import path from "path";
import sharp from "sharp";
import { google } from "googleapis";
import driveAuth from "../config/drive.js";
class GoogleDriveService {
    getFolderId() {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
        if (!folderId) {
            throw new Error("GOOGLE_DRIVE_FOLDER_ID is not defined");
        }
        return folderId;
    }
    async getDrive() {
        this.getFolderId();
        const auth = await driveAuth;
        return google.drive({
            version: "v3",
            auth,
        });
    }
    async optimizeImage(inputPath) {
        const outputPath = path.join(path.dirname(inputPath), `compressed-${path.basename(inputPath, path.extname(inputPath))}.webp`);
        await sharp(inputPath)
            .rotate()
            .resize({
            width: 1200,
            withoutEnlargement: true,
        })
            .webp({
            quality: 80,
            effort: 6,
        })
            .toFile(outputPath);
        return outputPath;
    }
    async uploadFile(localPath, fileName) {
        const folderId = this.getFolderId();
        const optimizedPath = await this.optimizeImage(localPath);
        const drive = await this.getDrive();
        try {
            const response = await drive.files.create({
                requestBody: {
                    name: `${fileName}.webp`,
                    parents: [folderId],
                },
                media: {
                    mimeType: "image/webp",
                    body: fs.createReadStream(optimizedPath),
                },
                fields: "id",
            });
            const fileId = response.data.id;
            if (!fileId) {
                throw new Error("Google Drive did not return a file ID");
            }
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: "reader",
                    type: "anyone",
                },
            });
            return {
                fileId,
                url: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
            };
        }
        finally {
            try {
                if (fs.existsSync(localPath)) {
                    await fs.promises.unlink(localPath);
                }
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error";
                console.error("Failed to delete original file:", message);
            }
            try {
                if (fs.existsSync(optimizedPath)) {
                    await fs.promises.unlink(optimizedPath);
                }
            }
            catch (err) {
                const message = err instanceof Error ? err.message : "Unknown error";
                console.error("Failed to delete optimized file:", message);
            }
        }
    }
    async deleteFile(fileId) {
        if (!fileId) {
            return;
        }
        try {
            const drive = await this.getDrive();
            await drive.files.delete({
                fileId,
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error("Google Drive delete error:", message);
        }
    }
    async replaceFile(oldFileId, localPath, fileName, type) {
        if (oldFileId) {
            await this.deleteFile(oldFileId);
        }
        return this.uploadFile(localPath, fileName);
    }
}
export default new GoogleDriveService();
//# sourceMappingURL=googleDriveService.js.map