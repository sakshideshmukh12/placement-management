
import prisma from "../prisma.js";

export const getDashboardSummary = async (userId: number) => {
  const [driveCount, applicationCount, interviewCount] =
    await Promise.all([
      prisma.placementDrive.count({
        where: {
          status: "OPEN",
          deadline: {
            gt: new Date(),
          },
        },
      }),

      prisma.application.count({
        where: {
          userId,
        },
      }),

      prisma.interview.count({
        where: {
          application: {
            userId,
          },
          scheduledAt: {
            gte: new Date(),
          },
        },
      }),
    ]);

  return {
    driveCount,
    applicationCount,
    interviewCount,
  };
};
