import { type drive_v3 } from "googleapis";
declare class GoogleDriveService {
    private getFolderId;
    getDrive(): Promise<drive_v3.Drive>;
    optimizeImage(inputPath: string): Promise<string>;
    uploadFile(localPath: string, fileName: string): Promise<{
        fileId: string;
        url: string;
    }>;
    deleteFile(fileId?: string): Promise<void>;
    replaceFile(oldFileId: string | undefined, localPath: string, fileName: string, type?: string): Promise<{
        fileId: string;
        url: string;
    }>;
}
declare const _default: GoogleDriveService;
export default _default;
//# sourceMappingURL=googleDriveService.d.ts.map