import { Router } from "express";
import {
  getNotifications,
    markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/notifications", authenticate, getNotifications);
router.patch("/notifications/:id/read", authenticate, markNotificationAsRead);

export default router;