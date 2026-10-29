import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Formik, Form } from "formik";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link,
  Paper,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import FormikTextField from "./components/forms/FormikTextField";
import { registerValidationSchema } from "./validation/validationSchemas";
import FormikSelectField from "./components/forms/FormikSelectField";
import { apiClient } from "./api/client";
import { API_ENDPOINTS_V1 } from "./utils/constants";
import type { AxiosError } from "axios";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  rollNumber: string;
  branch: string;
  year: string;
};

type ApiResponse = {
  message?: string;
  error?: string;
};

const initialFormData: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  rollNumber: "",
  branch: "",
  year: "",
};

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    values: RegisterFormData,
    { setSubmitting }: {
      setSubmitting: (isSubmitting: boolean) => void;
    },
  ) => {
    setError("");

    const payload: RegisterFormData = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
      rollNumber: values.rollNumber.trim(),
      branch: values.branch.trim(),
      year: values.year.trim(),
    };

      try {
      const response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS_V1.REGISTER,
        payload,
      );

      const result = response.data;

      navigate("/login", {
        replace: true,
        state: {
          message:
            result.message || "Registration successful! Please log in.",
        },
      });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiResponse>;

      if (axiosError.isAxiosError) {
        const message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          (axiosError.code === "ERR_NETWORK"
            ? "Cannot connect to the server. Please check your connection."
            : "Registration failed. Please try again.");

        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "linear-gradient(135deg, #f1f5ff 0%, #f8fafc 50%, #e8f0ff 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              mx: "auto",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "common.white",
            }}
          >
            <SchoolOutlinedIcon sx={{ fontSize: 34 }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Student Registration
          </Typography>

          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Create your PlaceTrack account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik<RegisterFormData>
          initialValues={initialFormData}
          validationSchema={registerValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <FormikTextField
                  name="name"
                  label="Full Name"
                  required
                  disabled={isSubmitting}
                  autoComplete="name"
                  placeholder="Enter your full name"
                />

                <FormikTextField
                  name="email"
                  label="Email Address"
                  type="email"
                  required
                  disabled={isSubmitting}
                  autoComplete="email"
                  placeholder="you@example.com"
                />

                <FormikTextField
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  helperText="Minimum 8 characters"
                  minLength={8}
                  endAdornment={
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      edge="end"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  }
                />

                <FormikTextField
                  name="rollNumber"
                  label="Roll Number"
                  required
                  disabled={isSubmitting}
                  placeholder="e.g. CSE2026001"
                />

                <FormikSelectField
                  name="branch"
                  label="Branch"
                  required
                  disabled={isSubmitting}
                  options={[
                    { label: "Computer Science (CSE)", value: "CSE" },
                    { label: "Information Technology (IT)", value: "IT" },
                    { label: "Electronics and Telecommunications (ENTC)", value: "ENTC" },
                    { label: "Mechanical Engineering", value: "Mechanical" },
                    { label: "Civil Engineering", value: "Civil" },
                    { label: "Electrical Engineering", value: "Electrical" },
                  ]}
                />

                <FormikSelectField
                  name="year"
                  label="Academic Year"
                  required
                  disabled={isSubmitting}
                  options={[
                    { label: "1st Year", value: "1st Year" },
                    { label: "2nd Year", value: "2nd Year" },
                    { label: "3rd Year", value: "3rd Year" },
                    { label: "4th Year", value: "4th Year" },
                  ]}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 0.5,
                    py: 1.4,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>

        <Typography
          variant="body2"
          sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}
        >
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="hover">
            Login
          </Link>
        </Typography>

        <Typography
          variant="caption"
          sx={{
            mt: 3,
            textAlign: "center",
            display: "block",
            color: "text.secondary",
          }}
        >
          PlaceTrack · Student Placement Portal
        </Typography>
      </Paper>
    </Box>
  );
  }
