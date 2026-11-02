
import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import multer from "multer";

const errorMiddleware = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Error:", err);

    // Handle JSON body-size limit errors
    if (
        typeof err === "object" &&
        err !== null &&
        "type" in err &&
        err.type === "entity.too.large"
    ) {
        res.status(413).json({
            message: "Request body is too large. Please reduce the payload size."
        });
        return;
    }

    // Handle Prisma database errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                res.status(409).json({
                    message: "A record with this value already exists"
                });
                return;

            case "P2003":
                res.status(400).json({
                    message: "Related record does not exist or violates a relationship constraint"
                });
                return;

            case "P2025":
                res.status(404).json({
                    message: "Record not found"
                });
                return;
        }
    }

    // Handle file upload errors
if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({
            message: "Resume file must not exceed 5 MB",
        });
        return;
    }

    if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
        res.status(400).json({
            message: "Please upload only one resume file",
        });
        return;
    }

    res.status(400).json({
        message: "Resume upload failed",
    });
    return;
}

// Handle rejected file types
if (err instanceof Error && err.message === "Only PDF resumes are allowed") {
    res.status(400).json({
        message: "Only PDF resumes are allowed",
    });
    return;
}

    res.status(500).json({
        message: "Internal server error"
    });
};

export default errorMiddleware;
