
import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import { http } from "../../api/http";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationResponse {
  statusCode: number;
  message: string;
  data: Notification[];
}

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);

  const notificationOpen = Boolean(notificationAnchor);

  const fetchNotifications = async () => {
    try {
      const response =
        await http.get<NotificationResponse>("/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Unable to load header notifications:", error);
    }
  };

  useEffect(() => {
    void fetchNotifications();
  }, []);

  const handleOpenNotifications = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setNotificationAnchor(event.currentTarget);
    void fetchNotifications();
  };

  const handleCloseNotifications = () => {
    setNotificationAnchor(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await http.patch(`/notifications/${notification.id}/read`);

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? { ...item, isRead: true }
              : item,
          ),
        );
      } catch (error) {
        console.error("Unable to mark notification as read:", error);
      }
    }

    handleCloseNotifications();
    navigate("/notifications");
  };

  const role = user?.role?.toUpperCase() ?? "STUDENT";

  const displayRole =
    role === "ADMIN"
      ? "Administrator"
      : role === "STUDENT"
        ? "Student"
        : role;

  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";

  const initials = displayName
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        color: "#172554",
        borderBottom: "1px solid #E8EDF5",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 64, md: 76 },
          px: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: 2,
              bgcolor: "#2458D3",
              color: "#FFFFFF",
            }}
          >
            <SchoolRoundedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: 18, md: 21 },
                fontWeight: 800,
                letterSpacing: "-0.6px",
                color: "#172554",
                lineHeight: 1.3,
              }}
            >
              PlaceTrack
            </Typography>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: 12,
                color: "#8290A5",
                mt: 0.3,
              }}
            >
              Student Placement Portal
            </Typography>
          </Box>
        </Box>

        <Chip
          label={displayRole}
          size="small"
          variant="outlined"
          sx={{
            display: { xs: "none", sm: "inline-flex" },
            fontWeight: 650,
            fontSize: 11.5,
            borderRadius: 2,
            color: role === "ADMIN" ? "#6D28D9" : "#2458D3",
            bgcolor: role === "ADMIN" ? "#F5F0FF" : "#EFF5FF",
            borderColor: role === "ADMIN" ? "#DDD0FF" : "#D5E3FF",
          }}
        />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            aria-label="Notifications"
            onClick={handleOpenNotifications}
            sx={{
              width: 40,
              height: 40,
              color: "#64748B",
              border: "1px solid #E8EDF5",
              borderRadius: 2.5,
              "&:hover": {
                bgcolor: "#F1F5FF",
                color: "#2458D3",
              },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={notificationAnchor}
          open={notificationOpen}
          onClose={handleCloseNotifications}
          slotProps={{
            paper: {
              sx: {
                width: { xs: 320, sm: 380 },
                maxWidth: "calc(100vw - 24px)",
                maxHeight: 440,
                mt: 1.5,
                borderRadius: 3,
                border: "1px solid #E8EDF5",
                boxShadow: "0 12px 32px rgba(23, 37, 84, 0.12)",
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography>
              Notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unreadCount} unread
            </Typography>
          </Box>

          <Divider />

          {notifications.length === 0 ? (
            <MenuItem disabled sx={{ py: 2 }}>
              No notifications yet.
            </MenuItem>
          ) : (
            <List disablePadding>
              {notifications.slice(0, 8).map((notification) => (
                <ListItemButton
                  key={notification.id}
                  onClick={() => void handleNotificationClick(notification)}
                  sx={{
                    alignItems: "flex-start",
                    py: 1.5,
                    px: 2,
                    bgcolor: notification.isRead
                      ? "background.paper"
                      : "#F1F5FF",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={
                      <>
                        <Typography
                          component="div"
                          variant="body2"
                          sx={{ mt: 0.5, color: "#475569" }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography   
                          component="div"
                          variant="body2"
                          sx={{ mt: 0.75, color: "#8290A5" }}
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  slotProps={{
  primary: {
    sx: {
      fontWeight: notification.isRead ? 600 : 800,
      fontSize: 13,
      color: "#172554",
    },
  },
}}
                  />
                </ListItemButton>
              ))}
            </List>
          )}

          <Divider />
          <MenuItem
            onClick={() => {
              handleCloseNotifications();
              navigate("/notifications");
            }}
            sx={{
              justifyContent: "center",
              color: "#2458D3",
              fontWeight: 700,
              py: 1.25,
            }}
          >
            View all notifications
          </MenuItem>
        </Menu>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", sm: "block" },
            my: 2,
            borderColor: "#E8EDF5",
          }}
        />

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1.2,
            maxWidth: 190,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#2458D3",
              fontSize: 14,
              fontWeight: 700,
              boxShadow: "0 3px 8px rgba(36, 88, 211, 0.18)",
            }}
          >
            {initials || "U"}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#172554",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 125,
              }}
            >
              {displayName}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#8290A5" }}>
              {displayRole}
            </Typography>
          </Box>

          <KeyboardArrowDownRoundedIcon
            sx={{ color: "#94A3B8", fontSize: 20 }}
          />
        </Box>

        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            aria-label="Logout"
            sx={{
              width: 40,
              height: 40,
              color: "#DC2626",
              border: "1px solid #FEE2E2",
              borderRadius: 2.5,
              "&:hover": {
                bgcolor: "#FEF2F2",
                borderColor: "#FECACA",
              },
            }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
