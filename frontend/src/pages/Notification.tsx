
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import {http} from "../api/http";

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

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setError("");
      const response =
        await http.get<NotificationResponse>("/notifications");

      setNotifications(response.data);
    } catch {
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await http.patch(`/notifications/${id}/read`);
      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch {
      setError("Unable to mark notification as read.");
    }   
  };

  useEffect(() => {
    void fetchNotifications();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {notifications.length === 0 ? (
        <Typography>No notifications yet.</Typography>
      ) : (
        <Paper>
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                divider
                secondaryAction={
                  !notification.isRead && (
                    <Button
                      onClick={() => void markAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )
                }
                sx={{
                  bgcolor: notification.isRead
                    ? "background.paper"
                    : "action.hover",
                }}
              >
                <ListItemText
                  primary={notification.title}
                  secondary={`${notification.message} • ${new Date(
                    notification.createdAt
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
