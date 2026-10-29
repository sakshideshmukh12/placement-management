
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { apiClient } from "../api/client";
import { API_ENDPOINTS_V1 } from "../utils/constants";

interface AnalyticsData {
  drives: {
    total: number;
    open: number;
    closed: number;
  };
  applications: {
    total: number;
    applied: number;
    shortlisted: number;
    selected: number;
    rejected: number;
  };
  students: {
    total: number;
    placed: number;
    notPlaced: number;
  };
  rates: {
    selectionRate: number;
    placementRate: number;
  };
  applicationStatusChart: {
    status: string;
    count: number;
  }[];
  driveStatusChart: {
    status: string;
    count: number;
  }[];
}

interface AnalyticsResponse {
  statusCode: number;
  message: string;
  data: AnalyticsData;
}

const chartColors = ["#2563EB", "#D97706", "#16A34A", "#DC2626"];

function PlacementAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

       const response = await apiClient.get<AnalyticsResponse>(
      API_ENDPOINTS_V1.PLACEMENT_DRIVES_ANALYTICS
);

        if (isMounted) {
          setAnalytics(response.data.data);
        }
      } catch {
        if (isMounted) {
          setError(
            "Unable to load placement analytics. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchAnalytics();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analytics) {
    return (
      <Alert severity="warning">
        No placement analytics data is available.
      </Alert>
    );
  }

  const summaryCards = [
    {
      title: "Total Drives",
      value: analytics.drives.total,
      detail: `${analytics.drives.open} open · ${analytics.drives.closed} closed`,
      color: "#2563EB",
      background: "#DBEAFE",
    },
    {
      title: "Total Applications",
      value: analytics.applications.total,
      detail: `${analytics.applications.applied} awaiting further processing`,
      color: "#7C3AED",
      background: "#EDE9FE",
    },
    {
      title: "Shortlisted",
      value: analytics.applications.shortlisted,
      detail: "Applications shortlisted",
      color: "#D97706",
      background: "#FEF3C7",
    },
    {
      title: "Selected",
      value: analytics.applications.selected,
      detail: `${analytics.rates.selectionRate}% selection rate`,
      color: "#16A34A",
      background: "#DCFCE7",
    },
    {
      title: "Placement Rate",
      value: `${analytics.rates.placementRate}%`,
      detail: `${analytics.students.placed} placed out of ${analytics.students.total} active students`,
      color: "#0891B2",
      background: "#CFFAFE",
    },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 750, color: "#172554", mb: 1 }}
      >
        Placement Analytics
      </Typography>

      <Typography sx={{ color: "#64748B", mb: 4 }}>
        Monitor placement drives, applications, and student placement outcomes.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #E2E8F0",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    backgroundColor: card.background,
                    color: card.color,
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {card.title}
                </Box>

                <Typography
                  variant="h4"
                  sx={{ color: "#172554", fontWeight: 750, mb: 1 }}
                >
                  {card.value}
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  {card.detail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#172554", mb: 3 }}
              >
                Applications by Status
              </Typography>

              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.applicationStatusChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar
                      dataKey="count"
                      name="Applications"
                      fill="#4F46E5"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid #E2E8F0",
              borderRadius: 3,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#172554", mb: 3 }}
              >
                Drive Status
              </Typography>

              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.driveStatusChart}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analytics.driveStatusChart.map((entry, index) => (
                        <Cell
                          key={entry.status}
                          fill={chartColors[index % chartColors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PlacementAnalytics;
