
import prisma from "../prisma.js";

export const createPlacementDrive = async (data: {
    role: string;
    package: number;
    eligibilityCriteria: string;
    deadline: Date;
    companyId: number;
}) => {
    return await prisma.placementDrive.create({
        data: {
            role: data.role,
            package: data.package,
            eligibilityCriteria: data.eligibilityCriteria,
            deadline: data.deadline,
            companyId: data.companyId
        }
    });
};

export const getPlacementDrives = async () => {
  return await prisma.placementDrive.findMany({
    include: {
      company: true,
    },
  });
};

export const getPlacementDriveById=async(id:number)=>{
    return await prisma.placementDrive.findUnique({
        where:{
            id:id
        }
    })
}


export const updatePlacementDrive = async (
    id: number,
    data: {
        role: string;
        package: number;
        eligibilityCriteria: string;
        deadline: Date;
        companyId: number;
    }
) => {
    return await prisma.placementDrive.update({
        where: { id },
        data: {
            role: data.role,
            package: data.package,
            eligibilityCriteria: data.eligibilityCriteria,
            deadline: data.deadline,
            companyId: data.companyId
        }
    });
};


export const patchPlacementDrive = async (
    id: number,
    data: {
        role?: string;
        package?: number;
        eligibilityCriteria?: string;
        deadline?: Date;
        companyId?: number;
        status?:"OPEN"|"CLOSED"
    }
) => {
    return await prisma.placementDrive.update({
        where: { id },
        data
    });
};


export const deletePlacementDrive = async (id: number) => {
    return await prisma.placementDrive.delete({
        where: { id }
    });
};

export const countDriveApplications = async (placementDriveId: number) => {
  return prisma.application.count({
    where: { placementDriveId },
  });
};


export const getDriveEligibilityData = async (placementDriveId: number) => {
  return prisma.placementDrive.findUnique({
    where: { id: placementDriveId },
    include: {
      company: true,
      applications: {
        select: {
          userId: true,
        },
      },
    },
  });
};

export const getPlacementAnalytics = async () => {
  const [
    totalDrives,
    openDrives,
    closedDrives,
    totalApplications,
    shortlistedApplications,
    selectedApplications,
    rejectedApplications,
    appliedApplications,
    totalStudents,
    placedStudents,
  ] = await Promise.all([
    prisma.placementDrive.count(),

    prisma.placementDrive.count({
      where: { status: "OPEN" },
    }),

    prisma.placementDrive.count({
      where: { status: "CLOSED" },
    }),

    prisma.application.count(),

    prisma.application.count({
      where: { status: "SHORTLISTED" },
    }),

    prisma.application.count({
      where: { status: "SELECTED" },
    }),

    prisma.application.count({
      where: { status: "REJECTED" },
    }),

    prisma.application.count({
      where: { status: "APPLIED" },
    }),

    prisma.user.count({
      where: { role: "STUDENT", isActive: true },
    }),

    prisma.user.count({
      where: {
        role: "STUDENT",
        isActive: true,
        applications: {
          some: { status: "SELECTED" },
        },
      },
    }),
  ]);

  const selectionRate =
    totalApplications > 0
      ? Number(((selectedApplications / totalApplications) * 100).toFixed(2))
      : 0;

  const placementRate =
    totalStudents > 0
      ? Number(((placedStudents / totalStudents) * 100).toFixed(2))
      : 0;

  return {
    drives: {
      total: totalDrives,
      open: openDrives,
      closed: closedDrives,
    },
    applications: {
      total: totalApplications,
      applied: appliedApplications,
      shortlisted: shortlistedApplications,
      selected: selectedApplications,
      rejected: rejectedApplications,
    },
    students: {
      total: totalStudents,
      placed: placedStudents,
      notPlaced: totalStudents - placedStudents,
    },
    rates: {
      selectionRate,
      placementRate,
    },
    applicationStatusChart: [
      { status: "Applied", count: appliedApplications },
      { status: "Shortlisted", count: shortlistedApplications },
      { status: "Selected", count: selectedApplications },
      { status: "Rejected", count: rejectedApplications },
    ],
    driveStatusChart: [
      { status: "Open", count: openDrives },
      { status: "Closed", count: closedDrives },
    ],
  };
};
