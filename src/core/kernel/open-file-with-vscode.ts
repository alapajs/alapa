/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { exec } from "child_process";
export const openFileWithVscode = (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      error:
        "Access denied. This endpoint is only accessible in development mode.",
    });
  }
  const { filePath } = req.body;
  const cleanPath = filePath.replace(/\)/g, "");

  // Construct the command
  const command = `code --reuse-window --goto ${cleanPath}`;
  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: "Failed to open file" });
    }
    res.status(200).json({ message: "File opened successfully" });
  });
  return;
};
