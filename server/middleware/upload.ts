import multer from "multer";
import type { Request } from "express";

import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const filename = `${Date.now()}-${file.originalname}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

export default upload;