
import type { Request, Response } from "express";
import { getDashboardSummary } from "../models/dashboard.model.js";

export const getDashboardSummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const auth = res.locals.auth as { id: number; role: string } | undefined;

    if (!auth) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const summary = await getDashboardSummary(auth.id);

    return res.status(200).json({
      message: "Dashboard summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard summary",
    });
  }
};
