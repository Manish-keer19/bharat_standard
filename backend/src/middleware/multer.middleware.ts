import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()); // Use system temp directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  }
});
