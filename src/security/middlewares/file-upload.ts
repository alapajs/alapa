import multer from "multer";
import { Request, Response, NextFunction } from "express";
const upload = multer({
  storage: multer.memoryStorage(), // Using memory storage for simplicity
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Use multer middleware globally for all routes
export const fileUpload = (req: Request, res: Response, next: NextFunction) => {
  upload.any()(req, res, (err: any) => {
    if (err) {
      return res.status(400).send("Error processing file uploads");
    }
    next();
  });
};
