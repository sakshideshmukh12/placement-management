
import prisma from "../prisma.js";

export const createNotification = async (data: {
    userId: number;
    title: string;
    message: string;
}) => {
    return await prisma.notification.create({
        data: {
            userId: data.userId,
            title: data.title,
            message: data.message,
        },
    });
};

export const getNotifications = async (userId: number) => {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const getNotificationById = async (
    id: number,
    userId: number
) => {
    return await prisma.notification.findFirst({
        where: { id, userId },
    });
};

export const markNotificationAsRead = async (
    id: number,
    userId: number
) => {
    return await prisma.notification.updateMany({
        where: { id, userId },
        data: { isRead: true },
    });
};

export const deleteNotification = async (
    id: number,
    userId: number
) => {
    return await prisma.notification.deleteMany({
        where: { id, userId },
    });
};
