
import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma.js";
import fs from "node:fs";
import path from "node:path";
import { open, unlink }from "node:fs/promises";


export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let filePath: string | undefined;

  try {
    const auth = res.locals.auth as
      | { id: number; role: string }
      | undefined;

    if (!auth) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    if (auth.role !== "STUDENT") {
      res.status(403).json({
        message: "Only students can upload resumes",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        message: "Please select a PDF resume to upload",
      });
      return;
    }

    filePath = req.file.path;

    // Verify the actual PDF file signature.
    const fileHandle = await open(filePath, "r");

    let signature: Buffer;

    try {
      signature = Buffer.alloc(5);
      await fileHandle.read(signature, 0, 5, 0);
    } finally {
      await fileHandle.close();
    }

    if (signature.toString("ascii") !== "%PDF-") {
      await unlink(filePath);
      filePath = undefined;

      res.status(400).json({
        message: "Invalid PDF file. Please upload a valid PDF resume.",
      });
      return;
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    await prisma.user.update({
      where: { id: auth.id },
      data: { resumeUrl },
    });

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl,
    });
  } catch (error) {
    // Remove the new file if validation or database saving fails.
    if (filePath) {
      try {
        await unlink(filePath);
      } catch (cleanupError) {
        console.error("Failed to remove uploaded resume:", cleanupError);
      }
    }

    next(error);
  }
};

export const downloadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = res.locals.auth as
      | { id: number; role: string }
      | undefined;

    if (!auth) {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: { resumeUrl: true },
    });

    if (!user?.resumeUrl) {
      res.status(404).json({
        message: "No resume uploaded yet",
      });
      return;
    }

    // Use only the filename stored in the database.
    const filename = path.basename(user.resumeUrl);
    const filePath = path.resolve("uploads", "resumes", filename);

    if (!fs.existsSync(filePath)) {
      res.status(404).json({
        message: "Resume file not found",
      });
      return;
    }

    res.download(filePath, "resume.pdf", (error) => {
      if (error) {
        if (!res.headersSent) {
          next(error);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

