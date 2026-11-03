
import type { Request, Response, NextFunction } from "express";
import {
    getNotifications as fetchNotifications,
    getNotificationById,
    markNotificationAsRead as updateNotificationReadStatus,
} from "../models/notification.model.js";

export const getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = res.locals.auth as { id: number; role: string };

        const notifications = await fetchNotifications(user.id);

        res.status(200).json({
            statusCode: 200,
            message: "Notifications fetched successfully",
            data: notifications,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const markNotificationAsRead = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = res.locals.auth as { id: number; role: string };
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                statusCode: 400,
                message: "Invalid notification ID",
            });
            return;
        }

        const notification = await getNotificationById(id, user.id);

        if (!notification) {
            res.status(404).json({
                statusCode: 404,
                message: "Notification not found",
            });
            return;
        }

        await updateNotificationReadStatus(id, user.id);

        res.status(200).json({
            statusCode: 200,
            message: "Notification marked as read",
        });
    } catch (error: unknown) {
        next(error);
    }
};
