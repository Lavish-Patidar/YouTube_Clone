//backend/middlewares/multerMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Create temp directory if it doesn't exist
const tempDir = "./temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only video and image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10GB
    files: 2 // Max 2 files (thumbnail + video)
  },
  fileFilter: fileFilter
});
